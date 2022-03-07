import { ActionType, createAction } from 'typesafe-actions';
import { AllActions, EntityStore } from '../types';

export const BATCH_ACTIONS = '@iiif/BATCH';

export const BATCH_IMPORT = '@iiif/BATCH_IMPORT';

export const batchActions = createAction(BATCH_ACTIONS)<{ actions: AllActions[] }>();

export const batchImport = createAction(BATCH_IMPORT)<{ state: EntityStore }>();

export type BatchAction = ActionType<typeof batchActions | typeof batchImport>;
