import { Vault } from '../src';
import { describe, test, expect } from 'vitest';
import invariant from 'tiny-invariant';
// @ts-ignore
import fixture from '../fixtures/presentation-3/has-part.json';

describe('Objects helper', () => {
  test('equality', async () => {
    const vault = new Vault();
    const manifest = await vault.loadManifestObject(fixture.id, fixture);

    invariant(manifest);

    expect(manifest.items[0].id).toEqual('https://iiif.io/api/cookbook/recipe/0005-image-service/canvas/p1');
    expect(manifest.items[0]).toEqual(manifest.items[0]); // Equality matches.

    expect(manifest.rendering).toEqual([]); // Property not in the original.

    // Cloned property.
    expect({ ...manifest.items[0] }).toMatchInlineSnapshot(`
      {
        "behavior": [],
        "duration": 0,
        "height": 3024,
        "id": "https://iiif.io/api/cookbook/recipe/0005-image-service/canvas/p1",
        "label": {
          "en": [
            "Canvas with a single IIIF image",
          ],
        },
        "metadata": [],
        "navDate": null,
        "requiredStatement": null,
        "rights": null,
        "service": [],
        "summary": null,
        "type": "Canvas",
        "width": 4032,
      }
    `);

    // @ts-ignore
    expect(manifest.items[0].thumbnail.service).toMatchInlineSnapshot('undefined');

    // @ts-ignore
    expect(manifest.items[0].items[0].items[0].body[0].service).toMatchInlineSnapshot(`
      [
        {
          "id": "https://iiif.io/api/image/3.0/example/reference/918ecd18c2592080851777620de9bcb5-gottingen",
          "profile": "level1",
          "type": "ImageService3",
        },
      ]
    `);
  });
});
