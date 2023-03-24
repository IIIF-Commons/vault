import { Vault } from '../vault';
import { LinkingNormalized, StructuralNormalized } from '@iiif/presentation-3';

function defineProperty(name: string, prototype: any, vault: Vault, enumerable = true) {
  prototype[DEFINED] = prototype[DEFINED] || [];
  prototype[DEFINED].push(name);

  const cache = new Map();

  Object.defineProperty(prototype, name, {
    enumerable,
    get(): any {
      if (typeof prototype[REFS][name] === 'undefined') {
        return undefined;
      }

      const ref = prototype[REFS][name];
      if (!ref) {
        return ref;
      }
      const object = vault.get(prototype[REFS][name], {
        parent: this.id ? { id: this.id, type: this.type } : undefined,
      });
      if (!cache.has(object)) {
        cache.clear();
        cache.set(object, wrapObject(object, vault));
      }
      return cache.get(object);
    },
    set(items: any) {
      const existing = prototype[REFS][name];
      if (existing !== items) {
        // This was a hack, but a much more clever implementation here could make very flexible editing.
        // For example - manifest.label = "Something" -> manifest.label = {none: "something"}; etc.
        // Although this might be better in a different library completely.
        if (this[REACTIVE]) {
          // Note: this should NOT be used for setting nested items. Only values.
          vault.modifyEntityField({ id: this.id, type: this.type }, name, unwrapObject(items));
        } else {
          this[REFS][name] = items;
        }
      }
    },
  });
}

export const REFS = Symbol.for('_refs_');
export const REACTIVE = Symbol.for('_reactive_');
export const DEFINED = Symbol.for('_defined_');
export const PARENT = Symbol.for('_parent_');

export type WrappedObject<OG = any> = {
  subscribe(subscription: (object: any, vault: Vault) => void, skipInitial?: boolean): () => void;
  reactive(): void;
  unreactive(): void;
  refresh(): void;
  unwrap(): OG;
  valueOf(): OG;
  toPresentation3(): any;
  toPresentation2(): any;
  is(refOrObject: any): boolean;
  toJSON(): any;
};

export type ReactiveWrapped<Full = any, T = any> = {} & WrappedObject<Full> &
  Omit<
    Full,
    | 'items'
    | 'annotations'
    | 'structures'
    | 'seeAlso'
    | 'rendering'
    | 'partOf'
    | 'start'
    | 'supplementary'
    | 'homepage'
    | 'thumbnail'
    | 'placeholderCanvas'
    | 'accompanyingCanvas'
    | 'provider'
    | 'body'
    | 'logo'
  > & {
    items: Full extends { items: (infer A)[] }
      ? (Full['items'][number] & ReactiveWrapped<any, Full['items'][number]>)[]
      : never;
    annotations: Full extends { annotations: (infer A)[] } ? ReactiveWrapped<any, Full['annotations'][number]>[] : never;
    structures: Full extends { structures: (infer A)[] } ? ReactiveWrapped<any, Full['structures'][number]>[] : never;
    seeAlso: Full extends { seeAlso: (infer A)[] } ? ReactiveWrapped<any, Full['seeAlso'][number]>[] : never;
    rendering: Full extends { rendering: (infer A)[] } ? ReactiveWrapped<any, Full['rendering'][number]>[] : never;
    partOf: Full extends { partOf: (infer A)[] } ? ReactiveWrapped<any, Full['partOf'][number]>[] : never;
    start: Full extends { start: (infer A)[] } ? ReactiveWrapped<any, Full['start'][number]>[] : never;
    supplementary: Full extends { supplementary: (infer A)[] }
      ? ReactiveWrapped<any, Full['supplementary'][number]>[]
      : never;
    homepage: Full extends { homepage: (infer A)[] } ? ReactiveWrapped<any, Full['homepage'][number]>[] : never;
    thumbnail: Full extends { thumbnail: (infer A)[] } ? ReactiveWrapped<any, Full['thumbnail'][number]>[] : never;
    placeholderCanvas: Full extends { placeholderCanvas: (infer A)[] }
      ? ReactiveWrapped<any, Full['placeholderCanvas'][number]>[]
      : never;
    accompanyingCanvas: Full extends { accompanyingCanvas: (infer A)[] }
      ? ReactiveWrapped<any, Full['accompanyingCanvas'][number]>[]
      : never;
    provider: Full extends { provider: (infer A)[] } ? ReactiveWrapped<any, Full['provider'][number]>[] : never;
    body: Full extends { body: (infer A)[] } ? ReactiveWrapped<any, Full['body'][number]>[] : never;
    logo: Full extends { logo: (infer A)[] } ? ReactiveWrapped<any, Full['logo'][number]>[] : never;
  };

function createPrototype<T, OG>(vault: Vault, reactive = false, parent?: string): ReactiveWrapped<T, OG> {
  const prototype: WrappedObject<OG> & {
    id: string;
    type: string;
    [REFS]: Record<string, any>;
    [DEFINED]: any[];
    [PARENT]: null | string;
    [REACTIVE]: null | (() => void);
  } = {
    id: '',
    type: 'unknown',
    [DEFINED]: [],
    [REFS]: {},
    [PARENT]: parent || null,
    [REACTIVE]: null,

    is(refOrObject: any) {
      if (typeof refOrObject === 'string') {
        return this.id === refOrObject;
      }

      if (refOrObject.id) {
        return refOrObject.id === this.id;
      }

      return false;
    },

    reactive() {
      if (this[REACTIVE]) {
        return;
      }

      this[REACTIVE] = this.subscribe(() => this.refresh(), true);

      return () => {
        this.unreactive();
      };
    },

    refresh() {
      if (this.id) {
        const fresh = this.unwrap();
        for (const key of Object.keys(fresh || {})) {
          if (this[DEFINED].includes(key)) {
            (this as any)[REFS][key] = (fresh as any)[key as any];
          } else {
            (this as any)[key] = (fresh as any)[key as any];
          }
        }
      }
    },

    unreactive() {
      if (this[REACTIVE]) {
        this[REACTIVE]();
        this[REACTIVE] = null;
      }
    },

    unwrap() {
      if (!this.id) {
        throw new Error('Invalid object');
      }
      const parent = this[PARENT];
      return vault.get(this.id, { parent: parent ? { id: parent, type: 'unknown' } : undefined });
    },

    toPresentation3() {
      return vault.toPresentation3(this.unwrap() as any);
    },

    toPresentation2() {
      return vault.toPresentation2(this.unwrap() as any);
    },

    valueOf() {
      return this.unwrap() as any;
    },

    toJSON() {
      const that = this as any;
      return {
        ...that,
        items: that.items,
        annotations: that.annotations,
        structures: that.structures,
        seeAlso: that.seeAlso,
        service: that.service,
        services: that.services,
        rendering: that.rendering,
        partOf: that.partOf,
        start: that.start,
        supplementary: that.supplementary,
        homepage: that.homepage,
        thumbnail: that.thumbnail,
        placeholderCanvas: that.placeholderCanvas,
        accompanyingCanvas: that.accompanyingCanvas,
        provider: that.provider,
      };
    },
    subscribe(subscription: (object: any, vault: Vault) => void, skipInitial = true) {
      return vault.subscribe(
        () => {
          return this.id ? vault.get(this.id) : null;
        },
        subscription,
        skipInitial
      );
    },
  };

  // Structural
  defineProperty('items', prototype, vault);
  defineProperty('annotations', prototype, vault);
  defineProperty('structures', prototype, vault);

  // Linking
  defineProperty('seeAlso', prototype, vault);
  // defineProperty('service', prototype, vault);
  // defineProperty('services', prototype, vault);
  defineProperty('rendering', prototype, vault);
  defineProperty('partOf', prototype, vault);
  defineProperty('start', prototype, vault, false);
  defineProperty('supplementary', prototype, vault);
  defineProperty('homepage', prototype, vault);

  // Descriptive
  defineProperty('thumbnail', prototype, vault);
  defineProperty('placeholderCanvas', prototype, vault, false);
  defineProperty('accompanyingCanvas', prototype, vault, false);
  defineProperty('provider', prototype, vault);

  // Annotation
  defineProperty('body', prototype, vault);
  defineProperty('logo', prototype, vault);

  return prototype as any;
}

export function isWrapped(object: any): object is WrappedObject {
  return !!object[DEFINED];
}

export function unwrapObject(object: any): any {
  if (Array.isArray(object)) {
    return object.map((o) => unwrapObject(o)) as any;
  }

  if (!object || !object.type) {
    return object;
  }

  return { id: object.id, type: object.type };
}

export function wrapObject<Type, NormalizedType = any>(
  object: any,
  vault: Vault,
  reactive = false,
  parent?: string
): ReactiveWrapped<Type, NormalizedType> {
  if (Array.isArray(object)) {
    return object.map((o) => wrapObject(o, vault, reactive)) as any;
  }
  if (!object || !object.type || !object.id) {
    return object;
  }

  const prototype = createPrototype(vault, reactive);
  const newObject = Object.create(prototype);

  const wrapped = Object.assign(newObject, object) as any;

  if (reactive) {
    wrapped.reactive();
  }

  return wrapped;
}
