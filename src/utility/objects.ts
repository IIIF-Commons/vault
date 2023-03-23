import { Vault } from '../vault';

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

function createPrototype(vault: Vault, reactive = false, parent?: string) {
  const prototype = {
    id: null,
    [DEFINED]: [] as any[],
    [REFS]: {},
    [PARENT]: (parent || null) as null | string,
    [REACTIVE]: null as null | (() => void),

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
            (this as any)[REFS][key] = fresh[key as any];
          } else {
            (this as any)[key] = fresh[key as any];
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
      return this.unwrap();
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

  return prototype;
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

export function wrapObject(object: any, vault: Vault, reactive = false, parent?: string): any {
  if (Array.isArray(object)) {
    return object.map((o) => wrapObject(o, vault, reactive));
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
