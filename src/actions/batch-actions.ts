import { ActionType, createAction } from 'typesafe-actions';
import { AllActions } from '../types';

export const BATCH_ACTIONS = '@iiif/BATCH';

export const batchActions = createAction(BATCH_ACTIONS)<{ actions: AllActions[] }>();

export type BatchAction = ActionType<typeof batchActions>;
