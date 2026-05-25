import { ApolloQueryResult, QueryResult } from '@apollo/client';
import isObject from 'lodash/isObject';
import { DateTime } from 'luxon';
import { QueryRoot } from '../generated/graphql';
import versionedTiamatEntities from '../generated/versionedTiamatEntities';

export type GqlQueryResultData = { __typename?: 'query_root' };

export type GqlQueryResult<TData extends GqlQueryResultData> = Pick<
  | QueryResult<TData> // from useQuery
  | ApolloQueryResult<TData>, // from apolloClient.query
  'data'
>;

export type GqlScalar =
  | string
  | number
  | boolean
  | null
  | undefined
  | DateTime
  | GeoJSON.Geometry
  | LocalizedString;

type StopRegistryEntities = (typeof versionedTiamatEntities)[
  | 'typesWithVersion'
  | 'typesWithId'
  | 'embeddedTypes'][number];

// this actually includes more than just the entity types, but at least is updated automatically by graphql-codegen
// Note: this does NOT include eg. timetables and stop registry DBs.
export type GqlEntityType = keyof QueryRoot | StopRegistryEntities;

export type GqlEntity = {
  __typename?: GqlEntityType;
  [key: string]: GqlEntity | GqlEntity[] | GqlScalar;
};

/**
 * Like `isGqlEntity` but not as type safe.
 * Can be used to check entity types that are not included in `GqlEntityType`.
 */
export const hasTypeName = (
  entity: unknown,
): entity is { __typename: string } =>
  isObject(entity) && '__typename' in entity;

export const isGqlEntity = (entity: unknown): entity is GqlEntity =>
  hasTypeName(entity);
