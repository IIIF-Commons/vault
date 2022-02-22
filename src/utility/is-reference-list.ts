import { CompatibleStore } from '@iiif/parser';

export function isReferenceList(state: CompatibleStore['entities'], id: string, type: string, key: string) {
  return !(
    !state[type] ||
    !state[type][id] ||
    !(state[type][id] as any)[key] ||
    !Array.isArray((state[type][id] as any)[key])
  );
}
