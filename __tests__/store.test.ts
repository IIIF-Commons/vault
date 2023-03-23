import { createStore } from '../src/store';
import { entityActions } from '../src/actions';
import { emptyCanvas, emptyManifest, normalize } from '@iiif/parser';
import { Collection, Manifest } from '@iiif/presentation-3';
import { describe, test, expect } from 'vitest';

describe('Store', function () {
  test('It should be creatable', () => {
    const store = createStore();

    expect(store).toBeDefined();
  });

  describe('collection then manifest', () => {
    //
    test('Bug: partOf collection', () => {
      const collection: Collection = {
        '@context': 'http://iiif.io/api/presentation/3/context.json',
        id: 'https://example.org/collection-1',
        type: 'Collection',
        label: { en: ['The collection'] },
        items: [],
      };

      const manifest: Manifest = {
        '@context': 'http://iiif.io/api/presentation/3/context.json',
        id: 'https://example.org/manifest-1',
        type: 'Manifest',
        label: { en: ['The manifest'] },
        items: [],
        partOf: [
          {
            id: 'https://example.org/collection-1',
            type: 'Collection',
          },
        ],
      };

      const store = createStore();

      store.dispatch(entityActions.importEntities(normalize(collection)));

      expect(store.getState().iiif.entities.Collection['https://example.org/collection-1'].label).toEqual({
        en: ['The collection'],
      });
      store.dispatch(entityActions.importEntities(normalize(manifest)));

      expect(store.getState().iiif.entities.Collection['https://example.org/collection-1'].label).toEqual({
        en: ['The collection'],
      });
    });
  });

  describe('Entity actions', () => {
    test('Import entity', () => {
      const store = createStore();

      store.dispatch(
        entityActions.importEntities({
          entities: {
            Manifest: {
              'https://example.org/manifest-1': {
                ...emptyManifest,
                id: 'https://example.org/manifest-1',
                type: 'Manifest',
                items: [],
              },
            },
          },
        })
      );

      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].id).toEqual(
        'https://example.org/manifest-1'
      );
    });

    test('Editing resources', () => {
      const store = createStore();

      store.dispatch(
        entityActions.importEntities({
          entities: {
            Manifest: {
              'https://example.org/manifest-1': {
                ...emptyManifest,
                id: 'https://example.org/manifest-1',
                type: 'Manifest',
                items: [
                  {
                    id: 'https://example.org/manifest-1/canvas-1',
                    type: 'Canvas',
                  },
                  {
                    id: 'https://example.org/manifest-1/canvas-2',
                    type: 'Canvas',
                  },
                ],
              },
            },
            Canvas: {
              'https://example.org/manifest-1/canvas-1': {
                ...emptyCanvas,
                id: 'https://example.org/manifest-1/canvas-1',
                type: 'Canvas',
              },
              'https://example.org/manifest-1/canvas-2': {
                ...emptyCanvas,
                id: 'https://example.org/manifest-1/canvas-2',
                type: 'Canvas',
              },
              'https://example.org/manifest-1/canvas-3': {
                ...emptyCanvas,
                id: 'https://example.org/manifest-1/canvas-3',
                type: 'Canvas',
              },
            },
          },
        })
      );

      store.dispatch(
        entityActions.modifyEntityField({
          id: 'https://example.org/manifest-1',
          type: 'Manifest',
          key: 'label',
          value: { en: ['An example label'] },
        })
      );

      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].label).toEqual({
        en: ['An example label'],
      });

      store.dispatch(
        entityActions.addReference({
          id: 'https://example.org/manifest-1',
          type: 'Manifest',
          key: 'items',
          reference: {
            id: 'https://example.org/manifest-1/canvas-3',
            type: 'Canvas',
          },
        })
      );

      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].items).toHaveLength(3);
      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].items).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.org/manifest-1/canvas-1",
            "type": "Canvas",
          },
          {
            "id": "https://example.org/manifest-1/canvas-2",
            "type": "Canvas",
          },
          {
            "id": "https://example.org/manifest-1/canvas-3",
            "type": "Canvas",
          },
        ]
      `);

      store.dispatch(
        entityActions.removeReference({
          id: 'https://example.org/manifest-1',
          type: 'Manifest',
          key: 'items',
          reference: {
            id: 'https://example.org/manifest-1/canvas-2',
            type: 'Canvas',
          },
        })
      );
      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].items).toHaveLength(2);
      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].items).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.org/manifest-1/canvas-1",
            "type": "Canvas",
          },
          {
            "id": "https://example.org/manifest-1/canvas-3",
            "type": "Canvas",
          },
        ]
      `);

      store.dispatch(
        entityActions.addReference({
          id: 'https://example.org/manifest-1',
          type: 'Manifest',
          key: 'items',
          reference: {
            id: 'https://example.org/manifest-1/canvas-2',
            type: 'Canvas',
          },
          index: 1,
        })
      );

      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].items).toHaveLength(3);
      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].items).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.org/manifest-1/canvas-1",
            "type": "Canvas",
          },
          {
            "id": "https://example.org/manifest-1/canvas-2",
            "type": "Canvas",
          },
          {
            "id": "https://example.org/manifest-1/canvas-3",
            "type": "Canvas",
          },
        ]
      `);

      // Reordering
      store.dispatch(
        entityActions.reorderEntityField({
          id: 'https://example.org/manifest-1',
          type: 'Manifest',
          key: 'items',
          startIndex: 1,
          endIndex: 2,
        })
      );

      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].items).toHaveLength(3);
      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].items).toMatchInlineSnapshot(`
        [
          {
            "id": "https://example.org/manifest-1/canvas-1",
            "type": "Canvas",
          },
          {
            "id": "https://example.org/manifest-1/canvas-3",
            "type": "Canvas",
          },
          {
            "id": "https://example.org/manifest-1/canvas-2",
            "type": "Canvas",
          },
        ]
      `);

      store.dispatch(
        entityActions.removeReference({
          id: 'https://example.org/manifest-1',
          type: 'Manifest',
          key: 'items',
          reference: {
            id: 'https://example.org/manifest-1/canvas-2',
            type: 'Canvas',
          },
          index: 3, // <-- THIS IS THE INCORRECT INDEX, CANVAS 2 IS AT INDEX 2
        })
      );
      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].items).toHaveLength(3);

      store.dispatch(
        entityActions.removeReference({
          id: 'https://example.org/manifest-1',
          type: 'Manifest',
          key: 'items',
          reference: {
            id: 'https://example.org/manifest-1/canvas-2',
            type: 'Canvas',
          },
          index: 2, // <-- THIS IS THE CORRECT INDEX
        })
      );
      expect(store.getState().iiif.entities.Manifest['https://example.org/manifest-1'].items).toHaveLength(2);
    });
  });
});
