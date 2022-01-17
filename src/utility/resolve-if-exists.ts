import { IIIFStore, NormalizedEntity } from '../types';

export function resolveIfExists<T extends NormalizedEntity>(state: IIIFStore, url: string): T | undefined {
  const request = state.iiif.requests[url];
  // Return the resource.
  const resourceType = state.iiif.mapping[url];
  if (!resourceType || !(state.iiif.entities as any)[resourceType][request.resourceUri]) {
    // Continue refetching resource, this is an invalid state.
    return undefined;
  }

  return (state.iiif.entities as any)[resourceType][request.resourceUri] as T;
}
