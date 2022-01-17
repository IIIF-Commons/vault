import { ActionType } from 'typesafe-actions';
import { ADD_MAPPING, ADD_MAPPINGS, mappingActions } from '../../actions';

export const mappingReducer = (state: Record<string, string> = {}, action: ActionType<typeof mappingActions> | any) => {
  switch (action.type) {
    case ADD_MAPPING:
      return {
        ...state,
        [action.payload.id]: action.payload.type,
      };

    case ADD_MAPPINGS:
      return {
        ...state,
        ...action.payload.mapping,
      };
    default:
      return state;
  }
};
