import {
  ApolloClient,
  concat,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { withScalars } from 'apollo-link-scalars';
import { buildClientSchema, IntrospectionQuery } from 'graphql';
import { DateTime } from 'luxon';
import introspectionResult from '../../graphql.schema.json';
import { isDateLike, parseDate } from '../time';
import { mapHttpToWs } from '../utils';
import { authRoleMiddleware } from './auth';

const buildScalarMappingLink = () => {
  const typesMap = {
    // automatically (de)serializing between graphql timestamptz <-> luxon.DateTime types
    timestamptz: {
      serialize: (parsed: unknown) => {
        // if it's a luxon DateTime, serialize it to ISO string
        if (DateTime.isDateTime(parsed)) {
          return parsed.toISO({ includeOffset: true });
        }
        // otherwise (string, null, undefined) just pass it on as is
        return parsed;
      },
      parseValue: (raw: unknown) => {
        if (!isDateLike(raw)) {
          throw new Error(`Invalid graphql date input: '${raw}'`);
        }

        return parseDate(raw);
      },
    },
  };

  const schema = buildClientSchema(
    // graphql-codegen's schema typings are off...
    introspectionResult as unknown as IntrospectionQuery,
  );

  return withScalars({ schema, typesMap });
};

export const createGraphqlClient = () => {
  const graphqlServerUrl = '/api/graphql/v1/graphql';

  const httpLink = new HttpLink({
    uri: graphqlServerUrl,
  });

  const scalarMappingLink = buildScalarMappingLink();
  const apolloLink = concat(
    authRoleMiddleware,
    concat(scalarMappingLink, httpLink),
  );

  // because next.js might run this on server-side and websockets aren't
  // supported there, we have to check if we are on browser before
  // initializing WebSocket link
  const wsLink = process.browser
    ? new WebSocketLink({
        // WebSocketLink doesn't work with relative url's, so we have to
        // turn relative url into absolute.
        uri: `${mapHttpToWs(window.location.origin)}${graphqlServerUrl}`,
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
      route_route: {
        keyFields: ['route_id'],
      },
      service_pattern_scheduled_stop_point: {
        keyFields: ['scheduled_stop_point_id'],
      },
    },
  });

  const client = new ApolloClient({
    link,
    cache,
    defaultOptions: {
      watchQuery: {
        // Should return cached query results first while rerunning the query against the backend.
        // After the backend response has returned, the query results are updated
        fetchPolicy: 'cache-and-network',
      },
    },
  });

  return client;
};
