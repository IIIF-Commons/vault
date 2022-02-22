import {
  RequestActions,
  REQUEST_COMPLETE,
  REQUEST_ERROR,
  REQUEST_MISMATCH,
  REQUEST_OFFLINE_RESOURCE,
  REQUEST_RESOURCE,
  RESOURCE_ERROR,
  RESOURCE_LOADING,
  RESOURCE_READY,
} from '../../actions';
import { RequestState } from '../../types';

export const requestReducer = (state: RequestState = {}, action: RequestActions) => {
  switch (action.type) {
    case REQUEST_RESOURCE:
    case REQUEST_OFFLINE_RESOURCE:
      return {
        ...state,
        [action.payload.id]: {
          requestUri: action.payload.id,
          loadingState: RESOURCE_LOADING,
          uriMismatch: false,
          resourceUri: action.payload.id,
        },
      };

    case REQUEST_MISMATCH:
      return {
        ...state,
        [action.payload.requestId]: {
          ...(state[action.payload.requestId] || {}),
          uriMismatch: true,
          resourceUri: action.payload.actualId,
        },
        [action.payload.actualId]: {
          requestUri: action.payload.requestId,
          loadingState: state[action.payload.requestId].loadingState,
          uriMismatch: true,
          resourceUri: action.payload.actualId,
        },
      };

    case REQUEST_ERROR:
      return {
        ...state,
        [action.payload.id]: {
          ...(state[action.payload.id] || {}),
          loadingState: RESOURCE_ERROR,
          error: action.payload.message,
        },
      };

    case REQUEST_COMPLETE:
      return {
        ...state,
        [action.payload.id]: {
          ...(state[action.payload.id] || {}),
          loadingState: RESOURCE_READY,
          error: undefined,
        },
      };
  }
  return state;
};
