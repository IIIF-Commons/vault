import * as Lib from './vault';
import { Entities } from './types';
import { getGlobal } from './utility/get-global';
import { VaultZustandStore } from './store';

export type VaultOptions = Lib.VaultOptions;
export type EntityRef<Ref extends keyof Entities> = Lib.EntityRef<Ref>;

const _importDynamic = new Function('modulePath', 'return import(modulePath)');
async function fetchInternal(...args: any[]) {
  if (typeof fetch !== 'undefined') {
    return (fetch as any)(...args);
  }
  const { default: fetch_ } = await _importDynamic('node-fetch');
  return fetch_(...args);
}

export class Vault extends Lib.Vault {
  constructor(options?: Partial<VaultOptions>, store?: VaultZustandStore) {
    const _options = options || {};
    _options.customFetcher = async (url: string) => {
      return fetchInternal(url).then((r) => r.json());
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
