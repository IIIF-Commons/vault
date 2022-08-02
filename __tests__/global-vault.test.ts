import '../src/global-vault';
import { globalVault } from '../src';

describe('global vault', () => {
  test('global vault defined', () => {
    const v1 = globalVault();

    expect(v1).toEqual(IIIF_VAULT);
  });
});
