import { ApolloLink, useQuery } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import { QueryHookOptions } from '@apollo/client/react/types/types';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DocumentNode } from 'graphql';

export const REQUESTED_HASURA_ROLE_HEADER = 'x-hasura-role';

export type Role = string;

export const roleHeaderMap = (hasuraRole: string) => {
  return { [REQUESTED_HASURA_ROLE_HEADER]: hasuraRole };
};

// TODO: avoid hardcoding role value. Use 'admin' for now
// to be able to continue development until things get sorted out
// regarding access control in hasura side
export const userHasuraRole = 'admin';

export const authRoleMiddleware = new ApolloLink((operation, forward) => {
  // const { role } = operation.variables;

  // add the requested authorization role to the headers if it is specified
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(userHasuraRole && roleHeaderMap(userHasuraRole)),
    },
  }));

  return forward(operation);
});

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
