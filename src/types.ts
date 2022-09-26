import {
  AnnotationCollection,
  AnnotationNormalized,
  AnnotationPageNormalized,
  CanvasNormalized,
  CollectionNormalized,
  ContentResource,
  ManifestNormalized,
  RangeNormalized,
  ResourceProviderNormalized,
  Selector,
  ServiceNormalized,
} from '@iiif/presentation-3';
import { MappingActions } from './actions/mapping-actions';
import { EntityActions } from './actions/entity-actions';
import { MetaActions } from './actions/meta-actions';
import { RequestActions } from './actions/request-actions';
import { Store } from 'redux';
import { BatchAction } from './actions';

export type MetaState = Record<string, Record<string, Record<string, any>>>;

export type RequestState = {
  [id: string]: {
    loadingState: 'RESOURCE_ERROR' | 'RESOURCE_LOADING' | 'RESOURCE_READY';
    uriMismatch: boolean;
    requestUri: string;
    resourceUri: string;
    error?: string;
  };
};

export type NormalizedEntity =
  | CollectionNormalized
  | ManifestNormalized
  | CanvasNormalized
  | AnnotationPageNormalized
  | AnnotationCollection
  | AnnotationNormalized
  | ContentResource
  | RangeNormalized
  | ServiceNormalized
  | ResourceProviderNormalized
  | Selector;

export type Entities = {
  Collection: {
    [id: string]: CollectionNormalized;
  };
  Manifest: {
    [id: string]: ManifestNormalized;
  };
  Canvas: {
    [id: string]: CanvasNormalized;
  };
  AnnotationPage: {
    [id: string]: AnnotationPageNormalized;
  };
  AnnotationCollection: {
    [id: string]: AnnotationCollection;
  };
  Annotation: {
    [id: string]: AnnotationNormalized;
  };
  ContentResource: {
    [id: string]: ContentResource;
  };
  Range: {
    [id: string]: RangeNormalized;
  };
  Service: {
    [id: string]: ServiceNormalized;
  };
  Selector: {
    [id: string]: Selector;
  };
  Agent: {
    [id: string]: ResourceProviderNormalized;
  };
};

export type EntityStore<Meta extends MetaState = MetaState> = {
  entities: Entities;
  mapping: Record<string, string>;
  requests: RequestState;
  meta: Meta;
};

export type IIIFStore<Meta extends MetaState = MetaState> = {
  iiif: EntityStore<Meta>;
};

export type AllActions = MappingActions | RequestActions | EntityActions | MetaActions;

export type ReduxStore = Store<IIIFStore, AllActions | BatchAction>;
