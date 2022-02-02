import { Vault, VaultOptions } from './vault';

declare global {
  const IIIF_VAULT: Vault;
}

function getGlobal(): any {
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  return {};
}

export function globalVault(options?: VaultOptions) {
  const g = getGlobal();
  try {
    const gv = g['IIIF_VAULT'];

    if (gv) {
      return gv;
    }
  } catch (e) {
    // no-op
  }

  const newVault = new Vault(options);

  try {
    g['IIIF_VAULT'] = newVault;
  } catch (e) {
    // no-op
  }

  return newVault;
}
