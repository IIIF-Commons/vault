import { MetaActions, SET_META_VALUE, SET_META_VALUE_DYNAMIC, UNSET_META_VALUE } from '../../actions';

type MetaState = Record<string, Record<string, Record<string, any>>>;

export const metaReducer = (state: MetaState = {}, action: MetaActions) => {
  const { id, updateValue, value, meta, key } = ((action && action.payload) || {}) as any;
  switch (action.type) {
    case SET_META_VALUE: {
      return {
        ...state,
        [id]: {
          ...(state[id] || {}),
          [meta]: {
            ...(state[id] ? state[id][meta] || {} : {}),
            [key]: value,
          },
        },
      };
    }
    case SET_META_VALUE_DYNAMIC: {
      return {
        ...state,
        [id]: {
          ...(state[id] || {}),
          [meta]: {
            ...(state[id] ? state[id][meta] || {} : {}),
            [key]: state[id] && state[id][meta] ? updateValue(state[id][meta][key]) : updateValue(undefined),
          },
        },
      };
    }

    case UNSET_META_VALUE: {
      if (state[id] && state[id][meta] && state[id][meta][key]) {
        return {
          ...state,
          [id]: {
            ...(state[id] || {}),
            [meta]: {
              ...(state[id] ? state[id][meta] || {} : {}),
              [key]: undefined,
            },
          },
        };
      }
      return state;
    }

    default:
      return state;
  }
};
