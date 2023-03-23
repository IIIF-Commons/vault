// @ts-ignore
import nlsManifest from '../fixtures/presentation-2/nls-manifest.json';
// @ts-ignore
import nlsManifest2 from '../fixtures/presentation-2/nls-manifest.json';
// @ts-ignore
import hasPart from '../fixtures/presentation-3/has-part.json';
import { Vault } from '../src/vault';
import { ManifestNormalized } from '@iiif/presentation-3-normalized';
import invariant from 'tiny-invariant';

describe('vault', () => {
  test('nls manifest 2', async () => {
    const vault = new Vault();
    const manifest = await vault.loadManifest(nlsManifest['@id'], nlsManifest);

    expect(manifest).toMatchInlineSnapshot(`
      {
        "@context": "http://iiif.io/api/presentation/3/context.json",
        "accompanyingCanvas": null,
        "annotations": [],
        "behavior": [
          "paged",
        ],
        "homepage": [],
        "id": "https://view.nls.uk/manifest/1286/9359/128693590/manifest.json",
        "iiif-parser:hasPart": [
          {
            "id": "https://view.nls.uk/manifest/1286/9359/128693590/manifest.json",
            "iiif-parser:partOf": "https://view.nls.uk/manifest/1286/9359/128693590/manifest.json",
            "type": "Manifest",
          },
        ],
        "items": [
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/1",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/2",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/3",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/4",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/5",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/6",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/7",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/8",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/9",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/10",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/11",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/12",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/13",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/14",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/15",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/16",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/17",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/18",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/19",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/20",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/21",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/22",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/23",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/24",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/25",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/26",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/27",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/28",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/29",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/30",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/31",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/32",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/33",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/34",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/35",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/36",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/37",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/38",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/39",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/40",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/41",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/42",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/43",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/44",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/45",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/46",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/47",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/48",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/49",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/50",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/51",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/52",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/53",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/54",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/55",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/56",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/57",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/58",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/59",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/60",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/61",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/62",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/63",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/64",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/65",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/66",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/67",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/68",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/69",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/70",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/71",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/72",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/73",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/74",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/75",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/76",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/77",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/78",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/79",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/80",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/81",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/82",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/83",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/84",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/85",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/86",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/87",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/88",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/89",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/90",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/91",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/92",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/93",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/94",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/95",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/96",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/97",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/98",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/99",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/100",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/101",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/102",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/103",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/104",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/105",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/106",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/107",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/108",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/109",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/110",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/111",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/112",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/113",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/114",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/115",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/116",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/117",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/118",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/119",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/120",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/121",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/122",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/123",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/124",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/125",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/126",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/127",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/128",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/129",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/130",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/131",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/132",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/133",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/134",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/135",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/136",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/137",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/138",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/139",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/140",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/141",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/142",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/143",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/144",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/145",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/146",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/147",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/148",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/149",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/150",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/151",
            "type": "Canvas",
          },
          {
            "id": "https://view.nls.uk/iiif/1286/9359/128693590/canvas/152",
            "type": "Canvas",
          },
        ],
        "label": {
          "none": [
            "Robert Burns. [A biography.]",
          ],
        },
        "metadata": [
          {
            "label": {
              "none": [
                "Title",
              ],
            },
            "value": {
              "none": [
                "Robert Burns. [A biography.]",
              ],
            },
          },
          {
            "label": {
              "none": [
                "Description",
              ],
            },
            "value": {},
          },
          {
            "label": {
              "none": [
                "Part reference",
              ],
            },
            "value": {
              "none": [
                "1933",
              ],
            },
          },
          {
            "label": {
              "none": [
                "Shelfmark",
              ],
            },
            "value": {
              "none": [
                "R.169.g",
              ],
            },
          },
          {
            "label": {},
            "value": {
              "none": [
                "<a href=\\"http://digital.nls.uk/128693590\\">View in our digital gallery</a>",
              ],
            },
          },
          {
            "label": {
              "none": [
                "Full conditions of use",
              ],
            },
            "value": {
              "none": [
                "You have permission to make copies of this work under the <a target=\\"_top\\" href=\\"http://creativecommons.org/licenses/by/4.0/\\">Creative Commons Attribution 4.0 International Licence</a> unless otherwise stated.",
              ],
            },
          },
        ],
        "navDate": null,
        "partOf": [],
        "placeholderCanvas": null,
        "provider": [],
        "rendering": [],
        "requiredStatement": {
          "label": {
            "none": [
              "Attribution",
            ],
          },
          "value": {
            "none": [
              "National Library of Scotland<br/>License: <a target=\\"_top\\" href=\\"http://creativecommons.org/licenses/by/4.0/\\">CC BY 4.0</a>",
            ],
          },
        },
        "rights": null,
        "seeAlso": [],
        "service": [],
        "services": [],
        "start": null,
        "structures": [],
        "summary": null,
        "thumbnail": [],
        "type": "Manifest",
        "viewingDirection": "left-to-right",
      }
    `);
  });

  test('batch mutation', async () => {
    const vault = new Vault();
    const manifest = await vault.loadManifest(nlsManifest2['@id'], nlsManifest2);

    invariant(manifest);

    let i = 0;
    vault.subscribe(() => {
      i++;
    }, true);

    vault.batch((v) => {
      v.modifyEntityField(manifest, 'label', { en: ['TEST LABEL VALUE'] });
      v.modifyEntityField(manifest, 'summary', { en: ['TEST SUMMARY VALUE'] });
    });

    expect(i).toEqual(1);

    expect(vault.get(manifest).label).toMatchInlineSnapshot(`
      {
        "en": [
          "TEST LABEL VALUE",
        ],
      }
    `);

    expect(vault.get(manifest).summary).toMatchInlineSnapshot(`
      {
        "en": [
          "TEST SUMMARY VALUE",
        ],
      }
    `);
  });

  test('skipSelfReturn', () => {
    const vault = new Vault();

    expect(vault.get({ id: 'https://example.org/not-in-vault', type: 'Manifest' }, { skipSelfReturn: false })).toEqual({
      id: 'https://example.org/not-in-vault',
      type: 'Manifest',
    });

    expect(vault.get({ id: 'https://example.org/not-in-vault', type: 'Manifest' }, { skipSelfReturn: true })).toEqual(
      null
    );
    expect(vault.get('https://example.org/not-in-vault', 'Manifest', { skipSelfReturn: true })).toEqual(null);
  });

  test('Has part integration', async () => {
    const vault = new Vault();
    const manifest = await vault.load<ManifestNormalized>(hasPart.id, hasPart);

    invariant(manifest);

    const canvas = vault.get(manifest.items[0]);

    invariant(canvas);

    const thumbnail0 = vault.get(canvas.thumbnail);
    const thumbnail1 = vault.get(canvas.thumbnail, { parent: canvas });

    const annoPage = vault.get(canvas.items[0]);
    const anno = vault.get(annoPage.items[0]);

    const thumbnail2 = vault.get(anno.body, { parent: anno });

    expect(thumbnail0).toMatchInlineSnapshot(`
      [
        {
          "format": "image/jpeg",
          "height": 3024,
          "id": "https://iiif.io/api/image/3.0/example/reference/918ecd18c2592080851777620de9bcb5-gottingen/full/max/0/default.jpg",
          "iiif-parser:hasPart": [
            {
              "@explicit": true,
              "format": {},
              "height": {},
              "id": "https://iiif.io/api/image/3.0/example/reference/918ecd18c2592080851777620de9bcb5-gottingen/full/max/0/default.jpg",
              "iiif-parser:partOf": "https://iiif.io/api/cookbook/recipe/0005-image-service/annotation/p0001-image",
              "service": {},
              "type": "Image",
              "width": {},
            },
            {
              "@explicit": true,
              "format": {},
              "id": "https://iiif.io/api/image/3.0/example/reference/918ecd18c2592080851777620de9bcb5-gottingen/full/max/0/default.jpg",
              "iiif-parser:partOf": "https://iiif.io/api/cookbook/recipe/0005-image-service/canvas/p1",
              "type": "Image",
            },
          ],
          "service": [
            {
              "id": "https://iiif.io/api/image/3.0/example/reference/918ecd18c2592080851777620de9bcb5-gottingen",
              "profile": "level1",
              "type": "ImageService3",
            },
          ],
          "type": "Image",
          "width": 4032,
        },
      ]
    `);

    expect(thumbnail1).toMatchInlineSnapshot(`
      [
        {
          "format": "image/jpeg",
          "id": "https://iiif.io/api/image/3.0/example/reference/918ecd18c2592080851777620de9bcb5-gottingen/full/max/0/default.jpg",
          "type": "Image",
        },
      ]
    `);
    expect(thumbnail2).toMatchInlineSnapshot(`
      [
        {
          "format": "image/jpeg",
          "height": 3024,
          "id": "https://iiif.io/api/image/3.0/example/reference/918ecd18c2592080851777620de9bcb5-gottingen/full/max/0/default.jpg",
          "service": [
            {
              "id": "https://iiif.io/api/image/3.0/example/reference/918ecd18c2592080851777620de9bcb5-gottingen",
              "profile": "level1",
              "type": "ImageService3",
            },
          ],
          "type": "Image",
          "width": 4032,
        },
      ]
    `);
  });
});
