import { ActionType } from 'typesafe-actions';
import { createAction } from '../utility/typesafe-actions-runtime';

import { Entities } from '../types';
import { InternationalString, SpecificResource } from '@iiif/presentation-3';

export const IMPORT_ENTITIES = '@iiif/IMPORT_ENTITIES';

export const MODIFY_ENTITY_FIELD = '@iiif/MODIFY_ENTITY_FIELD';

export const REORDER_ENTITY_FIELD = '@iiif/REORDER_ENTITY_FIELD';

export const ADD_REFERENCE = '@iiif/ADD_REFERENCE';
export const UPDATE_REFERENCE = '@iiif/UPDATE_REFERENCE';

export const REMOVE_REFERENCE = '@iiif/REMOVE_REFERENCE';

export const ADD_METADATA = '@iiif/ADD_METADATA';
export const REMOVE_METADATA = '@iiif/REMOVE_METADATA';
export const UPDATE_METADATA = '@iiif/UPDATE_METADATA';
export const REORDER_METADATA = '@iiif/REORDER_METADATA';

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
  reference: SpecificResource | ({ id: string; type: string } & any);
}>();

export const removeReference = createAction(REMOVE_REFERENCE)<{
  type: keyof Entities;
  id: string;
  key: string;
  index?: number;
  reference: SpecificResource | ({ id: string; type: string } & any);
}>();

export const updateReference = createAction(UPDATE_REFERENCE)<{
  type: keyof Entities;
  id: string;
  key: string;
  index: number;
  reference: SpecificResource | ({ id: string; type: string } & any);
}>();

export const addMetadata = createAction(ADD_METADATA)<{
  id: string;
  type: keyof Entities;
  beforeIndex?: number;
  label: InternationalString;
  value: InternationalString;
}>();
export const updateMetadata = createAction(UPDATE_METADATA)<{
  id: string;
  type: keyof Entities;
  atIndex?: number;
  label: InternationalString;
  value: InternationalString;
}>();
export const removeMetadata = createAction(REMOVE_METADATA)<{
  id: string;
  type: keyof Entities;
  atIndex: number;
}>();
export const reorderMetadata = createAction(REORDER_METADATA)<{
  id: string;
  type: keyof Entities;
  startIndex: number;
  endIndex: number;
}>();

export const entityActions = {
  importEntities,
  modifyEntityField,
  reorderEntityField,
  addReference,
  removeReference,
  updateReference,
  addMetadata,
  removeMetadata,
  updateMetadata,
  reorderMetadata,
};

export type EntityActions = ActionType<typeof entityActions>;
