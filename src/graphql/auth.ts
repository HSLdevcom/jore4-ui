import { useQuery } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import { QueryHookOptions } from '@apollo/client/react/types/types';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DocumentNode } from 'graphql';

export type Role = string;

export function useQueryWithRole<T>(
  query: DocumentNode | TypedDocumentNode<T, OperationVariables>,
  role: Role,
  options?: QueryHookOptions<T>,
) {
  return useQuery(query, {
    ...options,
    variables: { ...options?.variables, role },
  });
}
