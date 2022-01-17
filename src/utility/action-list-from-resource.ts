import { normalize } from '@iiif/parser';
import { AllActions } from '../types';
import { addMapping, addMappings, importEntities, requestComplete, requestError, requestMismatch } from '../actions';

export const actionListFromResource = (id: string, response: unknown): AllActions[] => {
  const { entities, resource, mapping } = normalize(response);
  if (resource.id === undefined) {
    return [requestError({ id, message: 'ID is not defined in resource.' })] as AllActions[];
  }
  // Always import and add mappings.
  const actions: AllActions[] = [importEntities({ entities: entities as any }), addMappings({ mapping })];
  // Check if we have a resource mismatch
  if (resource.id !== id) {
    actions.push(addMapping({ id, type: resource.type as string }));
    actions.push(requestMismatch({ requestId: id, actualId: resource.id }));
  }
  // Finally mark as complete.
  actions.push(requestComplete({ id }));
  // and return.
  return actions;
};
