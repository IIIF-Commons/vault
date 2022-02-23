import * as vaultModule from './vault';
import { getGlobal } from './utility/get-global';

declare global {
  const IIIF_VAULT: vaultModule.Vault;
  const IIIFVault: typeof vaultModule;
}

export function globalVault(options?: vaultModule.VaultOptions) {
  const g = getGlobal();
  try {
    const gv = g['IIIF_VAULT'];

    if (gv) {
      return gv;
    }
  } catch (e) {
    // no-op
  }

  const newVault = new vaultModule.Vault(options);

  try {
    g['IIIF_VAULT'] = newVault;
  } catch (e) {
    // no-op
  }

  return newVault;
}
