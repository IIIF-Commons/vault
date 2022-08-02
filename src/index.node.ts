import fetch from 'node-fetch';
import * as Lib from './vault';
import { Entities } from './types';
import { getGlobal } from './utility/get-global';
import { VaultZustandStore } from './store';

export type VaultOptions = Lib.VaultOptions;
export type EntityRef<Ref extends keyof Entities> = Lib.EntityRef<Ref>;

export class Vault extends Lib.Vault {
  constructor(options?: Partial<VaultOptions>, store?: VaultZustandStore) {
    const _options = options || {};
    _options.customFetcher = (url: string) => {
      return fetch(url).then((r) => r.json());
    };
    super(_options, store);
  }
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
