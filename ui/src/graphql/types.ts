import { ApolloQueryResult, QueryResult } from '@apollo/client';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import { DateTime } from 'luxon';
import { QueryRoot } from '../generated/graphql';

export type GqlQueryResultData = { __typename?: 'query_root' };
export type GqlMutationResultData = { __typename?: 'mutation_root' };

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

// this actually includes more than just the entity types, but at least is updated automatically by graphql-codegen
export type GqlEntityType = keyof QueryRoot;

export type GqlEntity = {
  __typename?: GqlEntityType;
  [key: string]: GqlEntity | GqlEntity[] | GqlScalar;
};

export const isGqlEntity = (entity: unknown): entity is GqlEntity =>
  isObject(entity) && '__typename' in entity;

export const isGqlEntityArray = (entity: unknown): entity is GqlEntity[] =>
  isArray(entity) && entity.every(isGqlEntity);
