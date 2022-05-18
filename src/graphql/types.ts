import { ApolloQueryResult, QueryResult } from '@apollo/client';
import { DateTime } from 'luxon';

export type GqlQueryResultData = { __typename?: 'query_root' };
export type GqlMutationResultData = { __typename?: 'mutation_root' };

export type GqlQueryResult<TData extends GqlQueryResultData> = Pick<
  | QueryResult<TData> // from useQuery
  | ApolloQueryResult<TData>, // from apolloClient.query
  'data'
>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type StoreType<T extends object> = {
  [Property in keyof T]: T[Property] extends DateTime ? string : T[Property];
};
