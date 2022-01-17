import { ActionType, createAction } from 'typesafe-actions';
import { Entities } from '../types';

export const IMPORT_ENTITIES = '@iiif/IMPORT_ENTITIES';

export const MODIFY_ENTITY_FIELD = '@iiif/MODIFY_ENTITY_FIELD';

export const importEntities = createAction(IMPORT_ENTITIES)<{ entities: Entities }>();

export const modifyEntityField = createAction(MODIFY_ENTITY_FIELD)<{
  type: keyof Entities;
  id: string;
  key: string;
  value: any;
}>();

export const entityActions = { importEntities, modifyEntityField };

export type EntityActions = ActionType<typeof entityActions>;
