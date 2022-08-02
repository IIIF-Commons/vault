import { BatchAction, BATCH_ACTIONS, BATCH_IMPORT } from '../../actions/batch-actions';
import { AllActions, IIIFStore, Reducer } from '../../types';

export function createBatchReducer(rootReducer: Reducer<IIIFStore, AllActions>) {
  return (state: IIIFStore, action: BatchAction | AllActions) => {
    if (action && action.type === BATCH_ACTIONS) {
      return action.payload.actions.reduce(rootReducer, state);
    }

    if (action && action.type === BATCH_IMPORT) {
      return {
        ...state,
        iiif: {
          ...state.iiif,
          ...action.payload.state,
        },
      } as IIIFStore;
    }

    return rootReducer(state, action);
  };
}
