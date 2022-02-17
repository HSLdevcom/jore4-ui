import {
  ApolloQueryResult,
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
  useApolloClient,
} from '@apollo/client';
import { useState } from 'react';
import { GqlQueryResultData } from '../graphql';

// based on https://github.com/apollographql/apollo-client/issues/7714
export const useAsyncQuery = <
  TData extends GqlQueryResultData,
  TVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
): [
  (variables: TVariables) => Promise<ApolloQueryResult<TData>>,
  { loading: boolean },
] => {
  const [loading, setLoading] = useState(false);
  const client = useApolloClient();

  const runQuery = async (variables: TVariables) => {
    setLoading(true);
    const res = await client.query<TData, TVariables>({ query, variables });
    setLoading(false);
    return res;
  };

  return [runQuery, { loading }];
};
