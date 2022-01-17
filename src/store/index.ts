import { createStore as createReduxStore, applyMiddleware, combineReducers, compose } from 'redux';
import { mappingReducer } from './reducers/mapping-reducer';
import { entitiesReducer } from './reducers/entities-reducer';
import { requestReducer } from './reducers/request-reducer';
import { metaReducer } from './reducers/meta-reducer';
import { ReduxStore } from '../types';

export const reducers = combineReducers({
  mapping: mappingReducer,
  entities: entitiesReducer,
  requests: requestReducer,
  meta: metaReducer,
});

const composeEnhancers =
  typeof window !== 'undefined' ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;

type CreateStoreOptions = {
  enableDevtools?: boolean;
  iiifStoreName?: string;
  customReducers?: any;
  extraMiddleware?: any[];
  defaultState?: any;
};

export function createStore(options: CreateStoreOptions = {}): ReduxStore {
  const {
    enableDevtools = true,
    iiifStoreName = 'iiif',
    defaultState = {},
    extraMiddleware = [],
    customReducers = {},
  } = options;

  const store = createReduxStore(
    combineReducers({ [iiifStoreName]: reducers, ...customReducers }),
    defaultState,
    enableDevtools
      ? composeEnhancers(applyMiddleware(...extraMiddleware))
      : compose(applyMiddleware(...extraMiddleware))
  );

  return store as any;
}
