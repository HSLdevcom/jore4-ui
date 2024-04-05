import {
  ApolloQueryResult,
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
  useApolloClient,
} from '@apollo/client';
import { useCallback, useState } from 'react';

// based on https://github.com/apollographql/apollo-client/issues/7714
export const useAsyncQuery = <
  TData extends { __typename?: 'query_root' },
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
): [
  (variables: TVariables) => Promise<ApolloQueryResult<TData>>,
  { loading: boolean },
] => {
  const [loading, setLoading] = useState(false);
  const client = useApolloClient();

  const runQuery = useCallback(
    async (variables: TVariables) => {
      setLoading(true);
      const res = await client.query<TData, TVariables>({ query, variables });
      setLoading(false);
      return res;
    },
    [client, query],
  );

  return [runQuery, { loading }];
};
