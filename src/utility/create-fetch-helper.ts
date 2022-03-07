import { actionListFromResource } from './action-list-from-resource';
import { Unsubscribe } from 'redux';
import { resolveIfExists } from './resolve-if-exists';
import { NormalizedEntity, ReduxStore } from '../types';
import {
  batchActions,
  requestError,
  requestResource,
  RESOURCE_ERROR,
  RESOURCE_LOADING,
  RESOURCE_READY
} from "../actions";

export function createFetchHelper<T>(
  store: ReduxStore,
  fetcher: (url: string, options?: T) => any | Promise<any>,
  { waitTimeout = 30 }: { waitTimeout?: number } = {}
) {
  return async (url: string, options?: T): Promise<NormalizedEntity | undefined> => {
    const state = store.getState();

    const request = state.iiif.requests[url];
    if (request) {
      switch (request.loadingState) {
        case RESOURCE_ERROR:
          // If it has errored, we will try again.
          break;
        case RESOURCE_LOADING: {
          // Subscribe and wait for resource to be done for X seconds, otherwise continue.
          let cleanupSubscription: Unsubscribe | undefined;
          let didContinue = false;
          try {
            const resolvedEntity = await Promise.race<NormalizedEntity | undefined>([
              new Promise<NormalizedEntity | undefined>((resolve, reject) => {
                if (didContinue) {
                  return;
                }
                cleanupSubscription = store.subscribe(() => {
                  const latestState = store.getState();

                  if (latestState.iiif.requests[url].loadingState === RESOURCE_ERROR) {
                    reject();
                    return;
                  }

                  if (latestState.iiif.requests[url].loadingState === RESOURCE_READY) {
                    const maybeResolvedEntity = resolveIfExists(latestState, url);
                    if (maybeResolvedEntity) {
                      resolve(maybeResolvedEntity);
                    } else {
                      reject();
                    }
                  }
                });
              }),
              new Promise<undefined>((resolve, reject) =>
                setTimeout(() => {
                  didContinue = true;
                  reject();
                }, waitTimeout * 60)
              ),
            ]);
            if (cleanupSubscription) {
              cleanupSubscription();
            }
            if (resolvedEntity) {
              return resolvedEntity;
            }
          } catch (e) {
            if (cleanupSubscription) {
              cleanupSubscription();
            }
            // If the promise rejected, then we will just continue.
            break;
          }

          break;
        }
        case RESOURCE_READY: {
          // Return the resource.
          const resolvedEntity = resolveIfExists(state, url);
          if (resolvedEntity) {
            return resolvedEntity;
          }

          // Continue refetching resource, this is an invalid state.
          break;
        }
      }

      // do nothing, and return?
    }

    store.dispatch(requestResource({ id: url }));
    try {
      const resource = await fetcher(url, options);
      const toDispatch = actionListFromResource(url, resource);
      store.dispatch(batchActions({ actions: toDispatch }));
      return resolveIfExists(store.getState(), url);
    } catch (err) {
      store.dispatch(requestError({ id: url, message: (err as any).toString() }));
      // Rethrow.
      throw err;
    }
  };
}
