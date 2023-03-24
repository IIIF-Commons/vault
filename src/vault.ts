/// <reference types="geojson" />

import { AllActions, Entities, IIIFStore, NormalizedEntity, RefToNormalized, RequestState } from './types';
import { Collection, Manifest, Reference, SpecificResource } from '@iiif/presentation-3';
import {
  frameResource,
  HAS_PART,
  isSpecificResource,
  PART_OF,
  serialize,
  SerializeConfig,
  serializeConfigPresentation2,
  serializeConfigPresentation3,
} from '@iiif/parser';
import { BATCH_ACTIONS, BatchAction, batchActions, entityActions, metaActions } from './actions';
import { createFetchHelper, areInputsEqual } from './utility';
import { createStore, VaultZustandStore } from './store';
import mitt, { Emitter } from 'mitt';
import { CollectionNormalized, ManifestNormalized } from '@iiif/presentation-3-normalized';
import { DEFINED, isWrapped, ReactiveWrapped, wrapObject } from './utility/objects';
import { resolveType } from './utility/resolve-type';

export type VaultOptions = {
  reducers: Record<string, any>;
  defaultState?: IIIFStore;
  customFetcher: <T>(url: string, options: T) => unknown | Promise<unknown>;
  enableDevtools: boolean;
};

export type GetOptions = {
  skipSelfReturn?: boolean;
  parent?: Reference<any> | string;
  preserveSpecificResources?: boolean;
  skipPartOfCheck?: boolean;
};
export type GetObjectOptions = GetOptions & { reactive?: boolean };

export type EntityRef<Ref extends keyof Entities> = IIIFStore['iiif']['entities'][Ref][string];

export class Vault {
  private readonly options: VaultOptions;
  private readonly store: VaultZustandStore;
  private readonly emitter: Emitter<any>;
  private isBatching = false;
  private batchQueue: AllActions[] = [];
  remoteFetcher: (str: string, options?: any) => Promise<NormalizedEntity | undefined>;
  staticFetcher: (str: string, json: any) => Promise<NormalizedEntity | undefined>;

  constructor(options?: Partial<VaultOptions>, store?: VaultZustandStore) {
    this.options = Object.assign(
      {
        reducers: {},
        customFetcher: this.defaultFetcher,
        enableDevtools: true,
      },
      options || {}
    );
    this.store =
      store ||
      createStore({
        customReducers: this.options.reducers,
        defaultState: this.options.defaultState,
        enableDevtools: this.options.enableDevtools,
      });
    this.emitter = mitt();
    this.remoteFetcher = createFetchHelper(this.store, this.options.customFetcher) as any;
    this.staticFetcher = createFetchHelper(this.store, (id: string, json: any) => json);
  }

  defaultFetcher = (url: string) => {
    return fetch(url).then((r) => r.json());
  };

  batch(cb: (vault: this) => void) {
    this.isBatching = true;
    try {
      cb(this);
      this.store.dispatch(batchActions({ actions: this.batchQueue }));
    } catch (e) {
      // Even if we error, we still need to reset the queue.
      this.batchQueue = [];
      this.isBatching = false;
      // And then rethrow.
      throw e;
    }
    this.batchQueue = [];
    this.isBatching = false;
  }

  async asyncBatch(cb: (vault: this) => Promise<void> | void) {
    this.isBatching = true;
    try {
      await cb(this);
      this.store.dispatch(batchActions({ actions: this.batchQueue }));
    } catch (e) {
      // Even if we error, we still need to reset the queue.
      this.batchQueue = [];
      this.isBatching = false;
      // And then rethrow.
      throw e;
    }
    this.batchQueue = [];
    this.isBatching = false;
  }

  modifyEntityField(entity: Reference<keyof Entities>, key: string, value: any) {
    this.dispatch(
      entityActions.modifyEntityField({
        id: entity.id,
        type: entity.type,
        key,
        value,
      })
    );
  }

  dispatch(action: any) {
    if (!this.isBatching) {
      this.store.dispatch(action);
    } else {
      this.batchQueue.push(action);
    }
  }

  middleware =
    (store: VaultZustandStore) =>
    (next: (action: AllActions | BatchAction) => IIIFStore) =>
    (action: AllActions | BatchAction): IIIFStore => {
      if (action.type === BATCH_ACTIONS) {
        for (const realAction of action.payload.actions) {
          this.emitter.emit(realAction.type, { realAction, state: store.getState() });
        }
        const state = next(action);
        for (const realAction of action.payload.actions) {
          this.emitter.emit(`after:${action.type}`, { action, state });
        }
        return state;
      }
      this.emitter.emit(action.type, { action, state: store.getState() });
      const state = next(action);
      this.emitter.emit(`after:${action.type}`, { action, state });
      return state;
    };

  serialize<Return>(entity: Reference<keyof Entities>, config: SerializeConfig) {
    return serialize<Return>(this.getState().iiif, entity, config);
  }

  toPresentation2<Return>(entity: Reference<keyof Entities>) {
    return this.serialize<Return>(entity, serializeConfigPresentation2);
  }

  toPresentation3<Return>(entity: Reference<keyof Entities>) {
    return this.serialize<Return>(entity, serializeConfigPresentation3);
  }

  hydrate<R extends { type?: string }>(
    reference: string | Partial<R>,
    type?: string | GetOptions,
    options?: GetOptions
  ): RefToNormalized<R>;
  hydrate<R extends { type?: string }>(
    reference: string[] | Partial<R>[],
    type?: string | GetOptions,
    options?: GetOptions
  ): RefToNormalized<R>[];
  hydrate<R extends { type?: string }>(
    reference: string | R | NormalizedEntity | string[] | R[] | NormalizedEntity[],
    type?: string | GetOptions,
    options: GetOptions = {}
  ): RefToNormalized<R> | RefToNormalized<R>[] {
    return this.get<R>(reference as any, type as any, { ...options, skipSelfReturn: false });
  }

  get<R extends { type?: string }>(
    reference: string | Partial<R> | Reference<R['type']> | SpecificResource<R>,
    type?: string | GetOptions,
    options?: GetOptions
  ): RefToNormalized<R>;
  get<R extends { type?: string }>(
    reference: string[] | Partial<R>[] | Reference<R['type']>[] | SpecificResource<R>[],
    type?: string | GetOptions,
    options?: GetOptions
  ): RefToNormalized<R>[];
  get<R extends { type?: string }>(
    reference:
      | string
      | R
      | NormalizedEntity
      | string[]
      | R[]
      | NormalizedEntity[]
      | SpecificResource<R>
      | SpecificResource<R>[],
    type?: string | GetOptions,
    options: GetOptions = {}
  ): RefToNormalized<R> | RefToNormalized<R>[] {
    if (typeof type !== 'string') {
      options = type || {};
      type = undefined;
    }

    const { skipSelfReturn = true } = options || {};
    let parent = options.parent ? (typeof options.parent === 'string' ? options.parent : options.parent.id) : undefined;

    // Multiples.
    if (Array.isArray(reference)) {
      return (reference as any[]).map((i) => this.get(i, options)) as EntityRef<any>[];
    }

    const state = this.getState();

    if (isSpecificResource(reference) && !options.preserveSpecificResources) {
      reference = reference.source;
    }

    // String IDs.
    if (typeof reference === 'string') {
      const _type: any = resolveType(type ? type : state.iiif.mapping[reference]);
      if (!_type) {
        if (skipSelfReturn) {
          return null as any;
        }
        return { id: reference, type: 'unknown' } as any;
      }
      reference = { id: reference, type: _type };
    }

    if (reference && reference.partOf && !parent && !options.skipPartOfCheck) {
      const first = Array.isArray(reference.partOf) ? reference.partOf[0] : reference.partOf;
      if (first) {
        if (typeof first === 'string') {
          parent = first;
        }
        if (typeof first.id === 'string') {
          parent = first.id;
        }
      }
    }

    const _type = resolveType(type ? type : (reference as any)?.type);
    const _id = (reference as any)?.id;
    const entities = (state.iiif.entities as any)[_type];
    if (!entities) {
      const request = state.iiif.requests[_id];
      if (request && request.resourceUri !== _id) {
        return this.get(request.resourceUri, options);
      }

      if (skipSelfReturn) {
        return null as any;
      }
      return reference as any;
    }

    const found = entities[(reference as any).id];
    if (found && found[HAS_PART]) {
      const framing = found[HAS_PART].find((t: any) => {
        return parent ? t[PART_OF] === parent : t[PART_OF] === found.id;
      });
      return frameResource(found, framing);
    }

    return entities[(reference as any).id] || (skipSelfReturn ? null : reference);
  }

  select<R>(selector: (state: IIIFStore) => R): R {
    return selector(this.getState());
  }

  getStore(): VaultZustandStore {
    return this.store;
  }

  getState(): IIIFStore {
    return this.store.getState();
  }

  deep(input?: any, prev?: any) {
    if (typeof input === 'undefined') {
      return this.get(prev, { skipSelfReturn: false });
    }
    if (typeof input === 'function') {
      try {
        const next = input(this.get(prev, { skipSelfReturn: false }));
        const fn: any = (newInput: any) => this.deep(newInput, next);
        fn.size = Array.isArray(next) ? next.length : 1;
        return fn;
      } catch (e) {
        const fn: any = (newInput: any) => this.deep(newInput, undefined);
        fn.size = 0;
        return fn;
      }
    }
    const fn: any = (newInput: any) => this.deep(newInput, input);
    fn.size = Array.isArray(input) ? input.length : 1;
    return fn;
  }

  loadManifest(id: string | Reference<any>, json?: unknown): Promise<ManifestNormalized | undefined> {
    const _id = typeof id === 'string' ? id : id.id;
    return this.load<ManifestNormalized>(_id, json);
  }

  loadCollection(id: string | Reference<any>, json?: unknown): Promise<CollectionNormalized | undefined> {
    const _id = typeof id === 'string' ? id : id.id;
    return this.load<CollectionNormalized>(_id, json);
  }

  load<T>(id: string | Reference<any>, json?: unknown): Promise<T | undefined> {
    const _id = typeof id === 'string' ? id : id.id;
    if (json) {
      return this.staticFetcher(_id, json) as Promise<T | undefined>;
    }
    return this.remoteFetcher(_id) as Promise<T | undefined>;
  }

  areInputsEqual(newInputs: readonly unknown[] | unknown, lastInputs: readonly unknown[] | unknown) {
    return areInputsEqual(newInputs, lastInputs);
  }

  subscribe<T>(
    selector: (state: IIIFStore) => T,
    subscription: (state: T, vault: Vault) => void,
    skipInitial: boolean
  ): () => void;
  subscribe<T>(subscription: (state: T, vault: Vault) => void, skipInitial?: boolean): () => void;
  subscribe<T>(
    selector: ((state: IIIFStore) => T) | ((state: T, vault: Vault) => void),
    subscription?: ((state: T, vault: Vault) => void) | boolean,
    skipInitial?: boolean
  ): () => void {
    if (
      typeof skipInitial === 'undefined' &&
      (typeof subscription === 'undefined' || subscription === false || subscription === true)
    ) {
      skipInitial = subscription;
      subscription = selector as any;
      selector = (a: any) => a;
    }

    return this.store.subscribe(selector as any, (s) => (subscription as any)(s, this), {
      equalityFn: areInputsEqual,
      fireImmediately: !skipInitial,
    });
  }

  async ensureLoaded(_id: string | Reference<any>): Promise<void> {
    const id = typeof _id === 'string' ? _id : _id.id;
    if (!this.requestStatus(id)) {
      await this.load(id);
    }
  }

  requestStatus(id: string): RequestState[any] | undefined {
    return this.select<RequestState[any]>((state) => {
      return state.iiif.requests[id];
    });
  }

  getResourceMeta<T = any>(resource: string): Partial<T> | undefined;
  getResourceMeta<T = any, Key extends keyof T = keyof T>(resource: string, metaKey: Key): T[Key] | undefined;
  getResourceMeta<T = any, Key extends keyof T = keyof T>(
    resource: string,
    metaKey?: Key
  ): Partial<T> | T[Key] | undefined {
    const resourceMeta = this.getState().iiif.meta[resource as any] as any;

    if (!resourceMeta) {
      return undefined;
    }
    if (!metaKey) {
      return resourceMeta as Partial<T>;
    }

    return resourceMeta[metaKey] as T[Key];
  }

  getObject<R extends { type?: string }>(
    reference: string | Partial<R>,
    type?: string | GetObjectOptions,
    options?: GetObjectOptions
  ): RefToNormalized<R>;
  getObject<R extends { type?: string }>(
    reference: string | R | NormalizedEntity,
    type?: string | GetObjectOptions,
    options: GetObjectOptions = {}
  ): RefToNormalized<R> {
    const { reactive, ...otherOptions } = options;
    return wrapObject(this.get(reference as any, type, otherOptions), this, reactive) as any;
  }

  async loadObject<Type, NormalizedType = any>(
    id: string | Reference<any>,
    json?: any
  ): Promise<ReactiveWrapped<Type, NormalizedType>> {
    return wrapObject<Type, NormalizedType>(await this.load(id, json), this);
  }
  async loadManifestObject(
    id: string | Reference<any>,
    json?: any
  ): Promise<ReactiveWrapped<Manifest, ManifestNormalized>> {
    return wrapObject<Manifest, ManifestNormalized>(await this.loadManifest(id, json), this);
  }
  async loadCollectionObject(
    id: string | Reference<any>,
    json?: any
  ): Promise<ReactiveWrapped<Collection, CollectionNormalized>> {
    return wrapObject<Collection, CollectionNormalized>(await this.loadCollection(id, json), this);
  }
  wrapObject<T extends string>(objectType: Reference<T>) {
    return wrapObject(this.get(objectType, { skipSelfReturn: false }), this);
  }
  isWrapped(object: any) {
    return isWrapped(object);
  }
  setMetaValue<Value = any>(
    [id, meta, key]: [string, string, string],
    newValueOrUpdate: Value | ((oldValue: Value | undefined) => Value)
  ) {
    this.dispatch(
      typeof newValueOrUpdate === 'function'
        ? metaActions.setMetaValueDynamic({
            id,
            meta: meta as any,
            key,
            updateValue: newValueOrUpdate as any,
          })
        : metaActions.setMetaValue({
            id,
            meta: meta as any,
            key,
            value: newValueOrUpdate,
          })
    );
  }
}
