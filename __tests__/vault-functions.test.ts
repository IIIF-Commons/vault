import { Vault } from '../src';
import { AnnotationNormalized } from '@iiif/presentation-3-normalized';

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
});
