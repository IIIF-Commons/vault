import { Entities } from '../../types';
import { getDefaultEntities } from '../../utility';
import { EntityActions, ADD_REFERENCE, IMPORT_ENTITIES, MODIFY_ENTITY_FIELD, REMOVE_REFERENCE } from '../../actions';
import { REORDER_ENTITY_FIELD } from '../../actions/entity-actions';
import { isReferenceList } from '../../utility/is-reference-list';

export const entitiesReducer = (state: Entities = getDefaultEntities(), action: EntityActions) => {
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

      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          [action.payload.id]: {
            ...entity,
            [action.payload.key]: action.payload.value,
          },
        },
      };
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

      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          [action.payload.id]: {
            ...entity,
            [action.payload.key]: result,
          },
        },
      };
    }
    case IMPORT_ENTITIES: {
      const keys = Object.keys(action.payload.entities) as Array<keyof Entities>;
      const toReturn: Entities = { ...state };

      for (const key of keys) {
        toReturn[key] = {
          ...(state[key] || {}),
          ...(action.payload.entities[key] || {}),
        } as any;
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

      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          [action.payload.id]: {
            ...entity,
            [action.payload.key]: result,
          },
        },
      };
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

      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          [action.payload.id]: {
            ...entity,
            [action.payload.key]: result,
          },
        },
      };
    }
    default:
      return state;
  }
};
