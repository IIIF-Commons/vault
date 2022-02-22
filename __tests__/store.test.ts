import { createStore } from '../src/store';
import { entityActions } from '../src/actions';
import { emptyCanvas, emptyManifest } from '@iiif/parser';

describe('Store', function () {
  test('It should be creatable', () => {
    const store = createStore();

    expect(store).toBeDefined();
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
        Array [
          Object {
            "id": "https://example.org/manifest-1/canvas-1",
            "type": "Canvas",
          },
          Object {
            "id": "https://example.org/manifest-1/canvas-2",
            "type": "Canvas",
          },
          Object {
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
        Array [
          Object {
            "id": "https://example.org/manifest-1/canvas-1",
            "type": "Canvas",
          },
          Object {
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
        Array [
          Object {
            "id": "https://example.org/manifest-1/canvas-1",
            "type": "Canvas",
          },
          Object {
            "id": "https://example.org/manifest-1/canvas-2",
            "type": "Canvas",
          },
          Object {
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
        Array [
          Object {
            "id": "https://example.org/manifest-1/canvas-1",
            "type": "Canvas",
          },
          Object {
            "id": "https://example.org/manifest-1/canvas-3",
            "type": "Canvas",
          },
          Object {
            "id": "https://example.org/manifest-1/canvas-2",
            "type": "Canvas",
          },
        ]
      `);
    });
  });
});
