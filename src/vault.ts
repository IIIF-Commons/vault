/// <reference types="geojson" />

import { AllActions, Entities, IIIFStore, NormalizedEntity, ReduxStore, RequestState } from './types';
import { CollectionNormalized, ManifestNormalized, Reference } from '@iiif/presentation-3';
import { serialize, SerializeConfig, serializeConfigPresentation2, serializeConfigPresentation3 } from '@iiif/parser';
import { BATCH_ACTIONS, BatchAction, batchActions, entityActions, metaActions } from './actions';
import { createFetchHelper, areInputsEqual } from './utility';
import { createStore } from './store';
import mitt, { Emitter } from 'mitt';

export type VaultOptions = {
  reducers: Record<string, any>;
  middleware: [];
  defaultState: any;
  customFetcher: <T>(url: string, options: T) => unknown | Promise<unknown>;
  enableDevtools: boolean;
};

export type GetOptions = { skipSelfReturn?: boolean };

export type EntityRef<Ref extends keyof Entities> = IIIFStore['iiif']['entities'][Ref][string];

export class Vault {
  private readonly options: VaultOptions;
  private readonly store: ReduxStore;
  private readonly emitter: Emitter<any>;
  private isBatching = false;
  private batchQueue: AllActions[] = [];
  remoteFetcher: (str: string, options?: any) => Promise<NormalizedEntity | undefined>;
  staticFetcher: (str: string, json: any) => Promise<NormalizedEntity | undefined>;

  constructor(options?: Partial<VaultOptions>, store?: ReduxStore) {
    this.options = Object.assign(
      {
        reducers: {},
        middleware: [],
        defaultState: {},
        customFetcher: this.defaultFetcher,
        enableDevtools: true,
      },
      options || {}
    );
    this.store =
      store ||
      createStore({
        customReducers: this.options.reducers,
        extraMiddleware: [...this.options.middleware, this.middleware],
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
    (store: ReduxStore) =>
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

  hydrate<Entity extends EntityRef<any>>(
    reference: string[] | Reference<any>[] | NormalizedEntity[],
    type?: string
  ): Entity[];
  hydrate<Entity extends EntityRef<any>>(reference: string[] | Reference<any>[] | NormalizedEntity[]): Entity[];
  hydrate<Entity extends EntityRef<any>>(reference: string | Reference<any> | NormalizedEntity, type?: string): Entity;
  hydrate<Entity extends EntityRef<any>>(reference: string | Reference<any> | NormalizedEntity): Entity;
  hydrate<Entity extends EntityRef<any>>(
    reference: string | Reference<any> | NormalizedEntity | string[] | Reference<any>[] | NormalizedEntity[],
    type?: string
  ): Entity | Entity[] {
    return this.get<Entity>(reference as any, type as any, { skipSelfReturn: false });
  }

  get<Entity extends EntityRef<any>>(
    reference: string[] | Reference<any>[] | NormalizedEntity[],
    type?: string,
    opt?: GetOptions
  ): Entity[];
  get<Entity extends EntityRef<any>>(
    reference: string[] | Reference<any>[] | NormalizedEntity[],
    opt?: GetOptions
  ): Entity[];
  get<Entity extends EntityRef<any>>(
    reference: string | Reference<any> | NormalizedEntity,
    type?: string,
    opt?: GetOptions
  ): Entity;
  get<Entity extends EntityRef<any>>(reference: string | Reference<any> | NormalizedEntity, opt?: GetOptions): Entity;
  get<Entity extends EntityRef<any>>(
    reference: string | Reference<any> | NormalizedEntity | string[] | Reference<any>[] | NormalizedEntity[],
    type?: string | GetOptions,
    options: GetOptions = {}
  ): Entity | Entity[] {
    if (typeof type !== 'string') {
      options = type || {};
      type = undefined;
    }

    const { skipSelfReturn = true } = options || {};

    // Multiples.
    if (Array.isArray(reference)) {
      return (reference as any[]).map((i) => this.get(i, options)) as EntityRef<any>[];
    }

    const state = this.getState();

    // String IDs.
    if (typeof reference === 'string') {
      const _type: any = type ? type : state.iiif.mapping[reference];
      if (!_type) {
        if (skipSelfReturn) {
          return null as any;
        }
        return { id: reference, type: 'unknown' } as any;
      }
      reference = { id: reference, type: _type };
    }

    const _type = type ? type : (reference as any).type;
    const _id = (reference as any).id;
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

    return entities[(reference as any).id] || (skipSelfReturn ? null : reference);
  }

  select<R>(selector: (state: IIIFStore) => R): R {
    return selector(this.getState());
  }

  getStore(): ReduxStore {
    return this.store;
  }

  getState(): IIIFStore {
    return this.store.getState();
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

    let lastState: T | null = skipInitial ? null : (selector as any)(this.store.getState());
    if (!skipInitial) {
      (subscription as any)(lastState as any, this);
    }
    return this.store.subscribe(() => {
      const state = this.store.getState();
      const selectedState = (selector as any)(state);
      if (!areInputsEqual(lastState, selectedState)) {
        (subscription as any)(selectedState, this);
      }
      lastState = selectedState;
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
