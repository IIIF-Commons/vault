import { BatchAction, BATCH_ACTIONS, BATCH_IMPORT } from '../../actions/batch-actions';
import { AllActions } from '../../types';
import { Reducer } from 'redux';

export function createBatchReducer(rootReducer: Reducer<AllActions>) {
  return (state: any, action: BatchAction | AllActions) => {
    if (action && action.type === BATCH_ACTIONS) {
      return action.payload.actions.reduce(rootReducer, state);
    }

    if (action && action.type === BATCH_IMPORT) {
      return action.payload.state;
    }

    return rootReducer(state, action);
  };
}
