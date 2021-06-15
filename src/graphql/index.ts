import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: 'http://localhost:8080/v1/graphql',
});

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
      httpLink,
    )
  : httpLink;

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
});

export const GQLClient = client;
