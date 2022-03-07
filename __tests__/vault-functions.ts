import { Vault } from '../src';
import { AnnotationNormalized } from '@iiif/presentation-3';

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
  });
});
