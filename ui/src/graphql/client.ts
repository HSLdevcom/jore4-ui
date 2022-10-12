import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { withScalars } from 'apollo-link-scalars';
import { buildClientSchema, IntrospectionQuery } from 'graphql';
import isString from 'lodash/isString';
import { DateTime, Duration } from 'luxon';
import introspectionResult from '../../graphql.schema.json';
import { isDateLike, parseDate } from '../time';
import { mapHttpToWs } from '../utils/url';
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
    // automatically (de)serializing between graphql interval <-> luxon.Duration types
    interval: {
      serialize: (parsed: unknown) => {
        // if it's a luxon Duration, serialize it to ISO string
        if (Duration.isDuration(parsed)) {
          return parsed.toISOTime();
        }
        // otherwise (string, null, undefined) just pass it on as is
        return parsed;
      },
      parseValue: (raw: unknown) => {
        if (!isString(raw)) {
          throw new Error(`Invalid graphql time input: '${raw}'`);
        }

        return Duration.fromISOTime(raw);
      },
    },
  };

  const schema = buildClientSchema(
    // graphql-codegen's schema typings are off...
    introspectionResult as unknown as IntrospectionQuery,
  );

  return withScalars({ schema, typesMap });
};

const buildWebSocketLink = (graphqlUrlPath: string) => {
  return new WebSocketLink({
    // WebSocketLink doesn't work with relative url's, so we have to
    // turn relative url into absolute.
    uri: `${mapHttpToWs(window.location.origin)}${graphqlUrlPath}`,
    options: {
      reconnect: true,
    },
  });
};

const buildHttpLink = (graphqlUrlPath: string, isTesting: boolean) => {
  const httpLinkConfig = isTesting
    ? {
        // `fetch` is not available in test context (with jest) so we have to provide it
        // eslint-disable-next-line global-require, import/no-extraneous-dependencies
        fetch: require('cross-fetch'),
        // logging in directly as admin, only works in e2e environment
        headers: { 'x-hasura-admin-secret': 'hasura' },
        uri: `http://localhost:3300${graphqlUrlPath}`,
      }
    : {
        uri: graphqlUrlPath,
      };
  return new HttpLink(httpLinkConfig);
};

const buildConnectionLink = (isBrowser: boolean, isTesting: boolean) => {
  const graphqlUrlPath = '/api/graphql/v1/graphql';

  // because next.js might run this on server-side and websockets aren't
  // supported there, we have to check if we are on browser before
  // initializing WebSocket link
  const httpLink = buildHttpLink(graphqlUrlPath, isTesting);
  if (isTesting || !isBrowser) {
    return httpLink;
  }
  const wsLink = buildWebSocketLink(graphqlUrlPath);
  return split(
    // if running a subscription query, prefer to use wsLink
    ({ query }) => {
      const definition = getMainDefinition(query);
      const isSubscription =
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription';
      return isSubscription;
    },
    wsLink,
    httpLink,
  );
};

const buildCacheDefinition = () => {
  const cacheDefinition = new InMemoryCache({
    typePolicies: {
      route_line: {
        keyFields: ['line_id'],
      },
      route_route: {
        keyFields: ['route_id'],
      },
      service_pattern_scheduled_stop_point: {
        keyFields: ['scheduled_stop_point_id'],
      },
      journey_pattern_scheduled_stop_point_in_journey_pattern: {
        keyFields: ['journey_pattern_id', 'scheduled_stop_point_sequence'],
      },
      journey_pattern_journey_pattern: {
        keyFields: ['journey_pattern_id'],
      },
      route_infrastructure_link_along_route: {
        keyFields: ['route_id', 'infrastructure_link_sequence'],
      },
      infrastructure_network_infrastructure_link: {
        keyFields: ['infrastructure_link_id'],
      },
    },
  });

  return cacheDefinition;
};

export const createGraphqlClient = () => {
  // jest and most testing frameworks set NODE_ENV to 'test' automatically
  const isTesting = process.env.NODE_ENV === 'test';

  const scalarMappingLink = buildScalarMappingLink();
  const connectionLink = buildConnectionLink(!!process.browser, isTesting);
  const link = from([scalarMappingLink, authRoleMiddleware, connectionLink]);

  const cache = buildCacheDefinition();

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
