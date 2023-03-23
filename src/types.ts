import {
  Annotation,
  AnnotationCollection,
  AnnotationPage,
  Canvas,
  Collection,
  ContentResource,
  Manifest,
  ResourceProvider,
  Selector,
  Service,
} from '@iiif/presentation-3';
import { MappingActions } from './actions/mapping-actions';
import { EntityActions } from './actions/entity-actions';
import { MetaActions } from './actions/meta-actions';
import { RequestActions } from './actions/request-actions';

import {
  AnnotationNormalized,
  AnnotationPageNormalized,
  CanvasNormalized,
  CollectionNormalized,
  ManifestNormalized,
  RangeNormalized,
  ResourceProviderNormalized,
  ServiceNormalized,
} from '@iiif/presentation-3-normalized';

declare global {
  // Work around for something else.
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface A {}
}

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

export type RefToNormalized<Ref extends { type?: string }> = Ref['type'] extends 'Manifest'
  ? ManifestNormalized
  : Ref['type'] extends 'Canvas'
  ? CanvasNormalized
  : Ref['type'] extends 'AnnotationPage'
  ? AnnotationPageNormalized
  : Ref['type'] extends 'AnnotationCollection'
  ? AnnotationCollection
  : Ref['type'] extends 'Annotation'
  ? AnnotationNormalized
  : Ref['type'] extends 'Range'
  ? RangeNormalized
  : Ref['type'] extends 'Service'
  ? ServiceNormalized
  : Ref['type'] extends 'ContentResource'
  ? ContentResource
  : Ref['type'] extends 'ResourceProvider'
  ? ResourceProviderNormalized
  : Ref['type'] extends 'Collection'
  ? CollectionNormalized
  : any;

export type RefToFull<Ref extends { type?: string }> = Ref['type'] extends 'Manifest'
  ? Manifest
  : Ref['type'] extends 'Canvas'
  ? Canvas
  : Ref['type'] extends 'AnnotationPage'
  ? AnnotationPage
  : Ref['type'] extends 'AnnotationCollection'
  ? AnnotationCollection
  : Ref['type'] extends 'Annotation'
  ? Annotation
  : Ref['type'] extends 'Range'
  ? Range
  : Ref['type'] extends 'Service'
  ? Service
  : Ref['type'] extends 'ContentResource'
  ? ContentResource
  : Ref['type'] extends 'ResourceProvider'
  ? ResourceProvider
  : Ref['type'] extends 'Collection'
  ? Collection
  : any;

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

export type Reducer<TState, TAction> = (state: TState | undefined, action: TAction) => TState;
