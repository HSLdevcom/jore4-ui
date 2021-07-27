import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
  split,
  useQuery,
} from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { QueryHookOptions } from '@apollo/client/react/types/types';
import { getMainDefinition } from '@apollo/client/utilities';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DocumentNode } from 'graphql';

const REQUESTED_HASURA_ROLE_HEADER = 'x-hasura-role';

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function useQueryWithRole<TData = any>(
  query: DocumentNode | TypedDocumentNode<TData, OperationVariables>,
  role: string,
  options?: QueryHookOptions<TData>,
) {
  return useQuery(query, {
    ...options,
    variables: { ...options?.variables, role },
  });
}

const authRoleMiddleware = new ApolloLink((operation, forward) => {
  // add the requested authorization role to the headers if it is specified
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(operation.variables.role && {
        [REQUESTED_HASURA_ROLE_HEADER]: operation.variables.role,
      }),
    },
  }));

  return forward(operation);
});

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/api/hasura/v1/graphql',
});

const apolloLink = concat(authRoleMiddleware, httpLink);

// because next.js might run this on server-side and websockets aren't
// supported there, we have to check if we are on browser before
// initializing WebSocket link
const wsLink = process.browser
  ? new WebSocketLink({
      uri: 'ws://localhost:8080/v1/graphql',
      options: {
        reconnect: true,
      },
    })
  : undefined;

const link = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        const isSubscription =
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription';
        return isSubscription;
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      wsLink!,
      apolloLink,
    )
  : apolloLink;

const cache = new InMemoryCache({
  typePolicies: {
    Subscription: {
      fields: {
        playground_points: {
          merge: false,
        },
      },
    },
  },
});

const client = new ApolloClient({
  link,
  cache,
});

export const GQLClient = client;
