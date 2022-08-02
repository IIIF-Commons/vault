import { ActionType } from 'typesafe-actions';
import { createAction } from '../utility/typesafe-actions-runtime';

export const RESOURCE_ERROR = 'RESOURCE_ERROR';
export const RESOURCE_LOADING = 'RESOURCE_LOADING';
export const RESOURCE_READY = 'RESOURCE_READY';

export const REQUEST_RESOURCE = '@iiif/REQUEST_RESOURCE';
export const REQUEST_ERROR = '@iiif/REQUEST_ERROR';
export const REQUEST_MISMATCH = '@iiif/REQUEST_MISMATCH';
export const REQUEST_COMPLETE = '@iiif/REQUEST_COMPLETE';
export const REQUEST_OFFLINE_RESOURCE = '@iiif/REQUEST_OFFLINE_RESOURCE';

export const requestResource = createAction(REQUEST_RESOURCE)<{ id: string }>();
export const requestError = createAction(REQUEST_ERROR)<{ id: string; message: string }>();
export const requestMismatch = createAction(REQUEST_MISMATCH)<{ requestId: string; actualId: string }>();
export const requestComplete = createAction(REQUEST_COMPLETE)<{ id: string }>();
export const requestOfflineResource = createAction(REQUEST_OFFLINE_RESOURCE)<{ id: string; entity: unknown }>();

export const requestActions = {
  requestResource,
  requestError,
  requestMismatch,
  requestComplete,
  requestOfflineResource,
};

export type RequestActions = ActionType<typeof requestActions>;
