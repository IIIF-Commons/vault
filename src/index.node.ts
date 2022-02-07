import fetch from 'node-fetch';
import * as Lib from './vault';
import { Entities } from './types';

export type VaultOptions = Lib.VaultOptions;
export type EntityRef<Ref extends keyof Entities> = Lib.EntityRef<Ref>;

export class Vault extends Lib.Vault {
  defaultFetcher = (url: string) => {
    return fetch(url).then((r) => r.json());
  };
}

export * from './types';
