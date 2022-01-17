import { Reference } from '@iiif/presentation-3';
import { IIIFStore, NormalizedEntity } from '../types';

export function resolveList<T extends NormalizedEntity>(
  state: IIIFStore,
  items: Reference<T>[]
): Array<NormalizedEntity> {
  const returnItems = [];
  for (const ref of items) {
    if ((state.iiif.entities as any)[ref.type] && (state.iiif.entities as any)[ref.type][ref.id]) {
      returnItems.push((state.iiif.entities as any)[ref.type][ref.id]);
    }
  }
  return returnItems as any[];
}
