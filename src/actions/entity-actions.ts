import { ActionType } from 'typesafe-actions';
import { createAction } from '../utility/typesafe-actions-runtime';

import { Entities } from '../types';

export const IMPORT_ENTITIES = '@iiif/IMPORT_ENTITIES';

export const MODIFY_ENTITY_FIELD = '@iiif/MODIFY_ENTITY_FIELD';

export const REORDER_ENTITY_FIELD = '@iiif/REORDER_ENTITY_FIELD';

export const ADD_REFERENCE = '@iiif/ADD_REFERENCE';

export const REMOVE_REFERENCE = '@iiif/REMOVE_REFERENCE';

export const importEntities = createAction(IMPORT_ENTITIES)<{ entities: Partial<Entities> }>();

export const modifyEntityField = createAction(MODIFY_ENTITY_FIELD)<{
  type: keyof Entities;
  id: string;
  key: string;
  value: any;
}>();

export const reorderEntityField = createAction(REORDER_ENTITY_FIELD)<{
  type: keyof Entities;
  id: string;
  key: string;
  startIndex: number;
  endIndex: number;
}>();

export const addReference = createAction(ADD_REFERENCE)<{
  type: keyof Entities;
  id: string;
  key: string;
  index?: number;
  reference: { id: string; type: string } & any;
}>();

export const removeReference = createAction(REMOVE_REFERENCE)<{
  type: keyof Entities;
  id: string;
  key: string;
  index?: number;
  reference: { id: string; type: string } & any;
}>();

export const entityActions = { importEntities, modifyEntityField, reorderEntityField, addReference, removeReference };

export type EntityActions = ActionType<typeof entityActions>;
