import { Entities } from '../../types';
import { getDefaultEntities } from '../../utility';
import {
  EntityActions,
  ADD_REFERENCE,
  IMPORT_ENTITIES,
  MODIFY_ENTITY_FIELD,
  REMOVE_REFERENCE,
  REORDER_ENTITY_FIELD,
} from '../../actions';
import { isReferenceList } from '../../utility/is-reference-list';
import { quickMerge } from '../../utility/quick-merge';

export const entitiesReducer = (state: Entities = getDefaultEntities(), action: EntityActions) => {
  const updateField = (entity: any, values: any) => {
    return {
      ...state,
      [(action.payload as any).type]: {
        ...((state as any)[(action.payload as any).type] as any),
        [(action.payload as any).id]: {
          ...entity,
          ...values,
        },
      },
    };
  };

  switch (action.type) {
    case MODIFY_ENTITY_FIELD: {
      // Invalid.
      if (!state[action.payload.type] || !state[action.payload.type][action.payload.id]) {
        return state;
      }

      const entity = state[action.payload.type][action.payload.id];
      if (typeof entity === 'string') {
        return state;
      }

      return updateField(entity, { [action.payload.key]: action.payload.value });
    }
    case REORDER_ENTITY_FIELD: {
      if (!isReferenceList(state, action.payload.id, action.payload.type, action.payload.key)) {
        return state;
      }

      const entity: any = state[action.payload.type][action.payload.id];
      if (typeof entity === 'string') {
        return state;
      }

      const result = Array.from(entity[action.payload.key]);
      const [removed] = result.splice(action.payload.startIndex, 1);
      result.splice(action.payload.endIndex, 0, removed);

      return updateField(entity, { [action.payload.key]: result });
    }
    case IMPORT_ENTITIES: {
      const keys = Object.keys(action.payload.entities) as Array<keyof Entities>;
      const toReturn: Entities = { ...state };

      for (const key of keys) {
        const entities = action.payload.entities[key];
        const newEntities: any = { ...(state[key] || {}) };
        let changed = false;
        const ids = (Object.keys(entities || {}) as string[]) || [];
        if (entities && ids) {
          for (const id of ids) {
            changed = true;
            newEntities[id] = state[key][id] ? quickMerge(state[key][id], entities[id]) : entities[id];
          }
          if (changed) {
            toReturn[key] = newEntities as any;
          }
        }
      }

      return toReturn;
    }

    case ADD_REFERENCE: {
      if (!isReferenceList(state, action.payload.id, action.payload.type, action.payload.key)) {
        return state;
      }

      const entity: any = state[action.payload.type][action.payload.id];
      const result = Array.from(entity[action.payload.key]);
      result.splice(action.payload.index || result.length + 1, 0, action.payload.reference);

      return updateField(entity, { [action.payload.key]: result });
    }
    case REMOVE_REFERENCE: {
      if (!isReferenceList(state, action.payload.id, action.payload.type, action.payload.key)) {
        return state;
      }

      const entity: any = state[action.payload.type][action.payload.id];
      const result = Array.from(entity[action.payload.key]);
      const indexToRemove =
        action.payload.index || result.findIndex((e: any) => e && e.id === action.payload.reference.id);

      if (indexToRemove === -1) {
        // Nothing to remove.
        return state;
      }
      if ((result as any[])[indexToRemove]?.id !== action.payload.reference.id) {
        // Invalid entity at this position, or the ID does not match.
        return state;
      }

      result.splice(indexToRemove, 1);

      return updateField(entity, { [action.payload.key]: result });
    }

    case '@iiif/ADD_METADATA': {
      const entity: any = state[action.payload.type][action.payload.id];
      if (!entity) {
        return state;
      }
      const metadata = Array.from(entity.metadata || []);
      metadata.splice(
        typeof action.payload.beforeIndex !== 'undefined' ? action.payload.beforeIndex : metadata.length + 1,
        0,
        {
          label: action.payload.label,
          value: action.payload.label,
        }
      );

      return updateField(entity, { metadata });
    }
    case '@iiif/REORDER_METADATA': {
      const entity: any = state[action.payload.type][action.payload.id];
      if (typeof entity === 'string' || !entity) {
        return state;
      }

      const metadata = Array.from(entity.metadata || []);
      const [removed] = metadata.splice(action.payload.startIndex, 1);
      metadata.splice(action.payload.endIndex, 0, removed);

      return updateField(entity, { metadata });
    }
    case '@iiif/UPDATE_METADATA':
    case '@iiif/REMOVE_METADATA': {
      const entity: any = state[action.payload.type][action.payload.id];
      const metadata = Array.from(entity.metadata || []);
      const indexToRemove = action.payload.atIndex;

      if (typeof indexToRemove === 'undefined' || indexToRemove === -1 || !(metadata as any[])[indexToRemove]) {
        // Nothing to remove.
        return state;
      }

      if (action.type === '@iiif/UPDATE_METADATA') {
        metadata.splice(indexToRemove, 1, { label: action.payload.label, value: action.payload.label });
      } else {
        metadata.splice(indexToRemove, 1);
      }

      return updateField(entity, { metadata });
    }

    default:
      return state;
  }
};
