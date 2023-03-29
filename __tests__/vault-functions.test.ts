import { Vault } from '../src';
import { AnnotationNormalized } from '@iiif/presentation-3-normalized';
import { describe, test, expect } from 'vitest';
import { updateReference, removeReference, addReference } from '../src/actions';
// @ts-ignore
import exhibit from '../fixtures/presentation-3/exhibit-2.json';
// @ts-ignore
import hasPart from '../fixtures/presentation-3/has-part.json';

describe('Vault functions', () => {
  test('Loading without an ID', async () => {
    const vault = new Vault();

    const ref = await vault.load<AnnotationNormalized>('https://example.org/annotation1', {
      type: 'Annotation',
      motivation: ['bookmarking'],
      target: 'https://example.org/some-manifest',
    });

    expect(ref!.id).toEqual('https://example.org/annotation1');
    expect(vault.get('https://example.org/annotation1')).toBeDefined();

    expect(vault.getState().iiif.requests).toMatchInlineSnapshot(`
      {
        "https://example.org/annotation1": {
          "error": undefined,
          "loadingState": "RESOURCE_READY",
          "requestUri": "https://example.org/annotation1",
          "resourceUri": "https://example.org/annotation1",
          "uriMismatch": false,
        },
      }
    `);
  });

  test('Loading multiple with an ID', async () => {
    const vault = new Vault();

    const ref1 = await vault.load<AnnotationNormalized>('https://example.org/annotation1', {
      id: 'https://example.org/annotation1',
      type: 'Annotation',
      motivation: ['bookmarking'],
      target: 'https://example.org/some-manifest',
    });

    const ref2 = await vault.load<AnnotationNormalized>('https://example.org/annotation2', {
      id: 'https://example.org/annotation2',
      type: 'Annotation',
      motivation: ['bookmarking'],
      target: 'https://example.org/some-manifest',
    });

    expect(ref1!.id).toEqual('https://example.org/annotation1');
    expect(ref2!.id).toEqual('https://example.org/annotation2');
    expect(vault.get('https://example.org/annotation1')).toBeDefined();
    expect(vault.get('https://example.org/annotation2')).toBeDefined();

    expect(vault.getState().iiif.requests).toMatchInlineSnapshot(`
      {
        "https://example.org/annotation1": {
          "error": undefined,
          "loadingState": "RESOURCE_READY",
          "requestUri": "https://example.org/annotation1",
          "resourceUri": "https://example.org/annotation1",
          "uriMismatch": false,
        },
        "https://example.org/annotation2": {
          "error": undefined,
          "loadingState": "RESOURCE_READY",
          "requestUri": "https://example.org/annotation2",
          "resourceUri": "https://example.org/annotation2",
          "uriMismatch": false,
        },
      }
    `);
  });

  // Selectors.
  const first = (i) => i.items[0];
  const nth = (n: number) => (i) => i[n];

  test('Loading specific resources', async () => {
    const vault = new Vault();
    const manifest = await vault.loadManifest(exhibit.id, exhibit);
    const canvases = vault.deep(manifest)((i) => i.items);

    // First canvas is YouTube.
    const youtubeCanvas = canvases(nth(0));
    // Second canvas is textual body
    const textBody = canvases(nth(1));
    // Third canvas has multiple images and annotations.
    const specificResource = canvases(nth(5));

    const ytAnnotation = youtubeCanvas(first)(first)((a) => a.body[0])();
    expect(ytAnnotation.type).toEqual('Video');

    const textAnnotation = textBody(first)(first)((a) => a.body[0])();
    expect(textAnnotation.format).toEqual('text/html');

    const specificAnno = specificResource(first)(first)();
    // Specific resource
    const specificResourceRef = specificAnno.body[0];
    expect(specificResourceRef.type).toEqual('SpecificResource');

    // Resolving the image.
    expect(vault.get(specificResourceRef).type).toEqual('Image');
    expect(vault.get(specificResourceRef).id).toEqual(
      'https://dlc.services/iiif-img/7/21/81efc6f1-2c2a-42ba-8001-c7e598d91110/full/full/0/default.jpg'
    );

    // Target
    expect(specificAnno.target.type).toEqual('SpecificResource');
    expect(vault.get(specificAnno.target).type).toEqual('Canvas');
  });

  test('updating reference', async () => {
    const vault = new Vault();
    const manifest = await vault.loadManifest(hasPart.id, hasPart);
    const canvas = vault.get(manifest.items[0]);

    // Adding normal reference.
    vault.dispatch(
      addReference({
        id: manifest.id,
        type: 'Manifest',
        key: 'items',
        index: 1,
        reference: { id: canvas.id, type: 'Canvas' },
      })
    );

    // Adding as a specific resource
    vault.dispatch(
      addReference({
        id: manifest.id,
        type: 'Manifest',
        key: 'items',
        index: 1,
        reference: {
          type: 'SpecificResource',
          source: { id: canvas.id, type: 'Canvas' },
        },
      })
    );

    const refList = vault.get(manifest).items;
    const newItemList = vault.get(refList);

    expect(refList).toEqual([
      { id: canvas.id, type: 'Canvas' },
      {
        type: 'SpecificResource',
        source: { id: canvas.id, type: 'Canvas' },
      },
      { id: canvas.id, type: 'Canvas' },
    ]);

    expect(newItemList).toHaveLength(3);

    expect(newItemList.map((r) => r.id)).toEqual([
      'https://iiif.io/api/cookbook/recipe/0005-image-service/canvas/p1',
      'https://iiif.io/api/cookbook/recipe/0005-image-service/canvas/p1',
      'https://iiif.io/api/cookbook/recipe/0005-image-service/canvas/p1',
    ]);

    expect(newItemList.map((r) => r.label)).toEqual([
      { en: ['Canvas with a single IIIF image'] },
      { en: ['Canvas with a single IIIF image'] },
      { en: ['Canvas with a single IIIF image'] },
    ]);

    vault.dispatch(
      updateReference({
        id: manifest.id,
        type: 'Manifest',
        key: 'items',
        index: 1,
        reference: {
          type: 'SpecificResource',
          source: { id: canvas.id, type: 'Canvas' },
          selector: { type: 'FragmentSelector', value: 'xywh=1,2,3,' },
        },
      })
    );

    const newItems = vault.get(manifest).items;

    expect(newItems).toHaveLength(3);

    expect(vault.get(manifest).items).toEqual([
      { id: canvas.id, type: 'Canvas' },
      {
        type: 'SpecificResource',
        source: { id: canvas.id, type: 'Canvas' },
        selector: { type: 'FragmentSelector', value: 'xywh=1,2,3,' },
      },
      { id: canvas.id, type: 'Canvas' },
    ]);
  });
});
