import { MappingActions, ADD_MAPPING, ADD_MAPPINGS } from '../../actions';

export const mappingReducer = (state: Record<string, string> = {}, action: MappingActions) => {
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
