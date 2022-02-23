import fetch from 'node-fetch';
import * as Lib from './vault';
import { Entities } from './types';
import { getGlobal } from './utility/get-global';

export type VaultOptions = Lib.VaultOptions;
export type EntityRef<Ref extends keyof Entities> = Lib.EntityRef<Ref>;

export class Vault extends Lib.Vault {
  defaultFetcher = (url: string) => {
    return fetch(url).then((r) => r.json());
  };
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

export * from './types';
