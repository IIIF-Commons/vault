import { IIIFStore, NormalizedEntity } from '../types';
import { frameResource, HAS_PART, PART_OF } from '@iiif/parser';

export function resolveIfExists<T extends NormalizedEntity>(state: IIIFStore, url: string, parent?: any): T | undefined {
  const request = state.iiif.requests[url];
  // Return the resource.
  const resourceType = state.iiif.mapping[url];
  if (!resourceType || !(state.iiif.entities as any)[resourceType][request.resourceUri]) {
    // Continue refetching resource, this is an invalid state.
    return undefined;
  }

  const fullEntity: any = (state.iiif.entities as any)[resourceType][request.resourceUri] as T;

  if (fullEntity && fullEntity[HAS_PART]) {
    const framing = fullEntity[HAS_PART].find((t: any) => {
      return parent ? t[PART_OF] === parent.id : t[PART_OF] === fullEntity.id;
    });

    return frameResource(fullEntity, framing);
  }

  return fullEntity;
}
