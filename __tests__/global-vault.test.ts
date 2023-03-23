import '../src/global-vault';
import { globalVault } from '../src';
import { describe, test, expect } from 'vitest';

describe('global vault', () => {
  test('global vault defined', () => {
    const v1 = globalVault();

    expect(v1).toEqual(IIIF_VAULT);
  });
});
