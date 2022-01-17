import { ActionType, createAction } from 'typesafe-actions';

export const ADD_MAPPING = '@iiif/ADD_MAPPING';
export const ADD_MAPPINGS = '@iiif/ADD_MAPPINGS';

export const addMapping = createAction(ADD_MAPPING)<{ id: string; type: string }>();
export const addMappings = createAction(ADD_MAPPINGS)<{ mapping: { [id: string]: string } }>();

export const mappingActions = { addMapping, addMappings };

export type MappingActions = ActionType<typeof mappingActions>;
