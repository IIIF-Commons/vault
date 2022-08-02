import { ActionType } from 'typesafe-actions';
import { createAction } from '../utility/typesafe-actions-runtime';

export const SET_META_VALUE = '@iiif/SET_META_VALUE';
export const SET_META_VALUE_DYNAMIC = '@iiif/SET_META_VALUE_DYNAMIC';
export const UNSET_META_VALUE = '@iiif/UNSET_META_VALUE';

const setMetaValue = createAction(SET_META_VALUE)<{ id: string; meta: string; key: string; value: any }>();
const setMetaValueDynamic = createAction(SET_META_VALUE_DYNAMIC)<{
  id: string;
  meta: string;
  key: string;
  updateValue: (oldValue: any) => any;
}>();
const unsetMetaValue = createAction(UNSET_META_VALUE)<{ id: string; meta: string; key: string }>();

export const metaActions = {
  setMetaValue,
  setMetaValueDynamic,
  unsetMetaValue,
};

export type MetaActions = ActionType<typeof metaActions>;
