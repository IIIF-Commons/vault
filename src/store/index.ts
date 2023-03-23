import { createStore as create } from 'zustand/vanilla';
import type { StoreApi } from 'zustand/vanilla';
import { redux, devtools, subscribeWithSelector } from 'zustand/middleware';
import { mappingReducer } from './reducers/mapping-reducer';
import { entitiesReducer } from './reducers/entities-reducer';
import { requestReducer } from './reducers/request-reducer';
import { metaReducer } from './reducers/meta-reducer';
import { combineReducers } from '../utility/combine-reducers';
import { AllActions, IIIFStore } from '../types';
import { BatchAction } from '../actions';
import { createBatchReducer } from './reducers/batch-reducer';
import { getDefaultEntities } from '../utility';

export const reducers = combineReducers({
  mapping: mappingReducer,
  entities: entitiesReducer,
  requests: requestReducer,
  meta: metaReducer,
});

type CreateStoreOptions = {
  enableDevtools?: boolean;
  iiifStoreName?: string;
  customReducers?: any;
  defaultState?: any;
};

function getDefaultState(): IIIFStore {
  return {
    iiif: {
      entities: getDefaultEntities(),
      meta: {},
      mapping: {},
      requests: {},
    },
  };
}
export type VaultStoreState = StoreApi<IIIFStore & { dispatch: (action: AllActions | BatchAction) => void }> & {
  dispatch: (action: AllActions | BatchAction) => void;
};

export function createStore(options: CreateStoreOptions = {}) {
  const {
    enableDevtools = false,
    iiifStoreName = 'iiif',
    defaultState = getDefaultState(),
    customReducers = {},
  } = options;

  const rootReducer = createBatchReducer(combineReducers({ [iiifStoreName]: reducers, ...customReducers }));
  const dv: typeof devtools = process.env.NODE_ENV === 'test' ? (a: any) => a : devtools;

  return create(subscribeWithSelector(dv(redux(rootReducer, defaultState), { enabled: enableDevtools })));
}

export type VaultZustandStore = ReturnType<typeof createStore>;
