import { ApolloQueryResult, QueryResult } from '@apollo/client';

export type GqlQueryResultData = { __typename?: 'query_root' };
export type GqlMutationResultData = { __typename?: 'mutation_root' };

export type GqlQueryResult<TData extends GqlQueryResultData> =
  | QueryResult<TData> // from useQuery
  | ApolloQueryResult<TData>; // from apolloClient.query
