import { BatchAction, BATCH_ACTIONS } from '../../actions/batch-actions';
import { AllActions } from '../../types';
import { Reducer } from 'redux';

export function createBatchReducer(rootReducer: Reducer<AllActions>) {
  return (state: any, action: BatchAction | AllActions) => {
    if (action && action.type === BATCH_ACTIONS) {
      return action.payload.actions.reduce(rootReducer, state);
    }

    return rootReducer(state, action);
  };
}
