import { ActionType } from 'typesafe-actions';
import { Entities } from '../../types';
import { getDefaultEntities } from '../../utility';
import { IMPORT_ENTITIES, importEntities, MODIFY_ENTITY_FIELD, modifyEntityField } from '../../actions';

export const entitiesReducer = (
  state: Entities = getDefaultEntities(),
  action: ActionType<typeof importEntities> | ActionType<typeof modifyEntityField>
) => {
  if (action.type === MODIFY_ENTITY_FIELD) {
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

  if (action.type === IMPORT_ENTITIES) {
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

  return state;
};
