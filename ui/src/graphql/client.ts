import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  split,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { withScalars } from 'apollo-link-scalars';
import { IntrospectionQuery, buildClientSchema } from 'graphql';
import isString from 'lodash/isString';
import { DateTime, Duration } from 'luxon';
import introspectionResult from '../../graphql.schema.json';
import { isDateLike, parseDate } from '../time';
import { mapHttpToWs } from '../utils/url';
import { authRoleMiddleware, roleHeaderMap, userHasuraRole } from './auth';

const buildScalarMappingLink = () => {
  const typesMap = {
    // automatically (de)serializing between graphql date <-> luxon.DateTime types
    date: {
      serialize: (parsed: unknown) => {
        // if it's a luxon DateTime, serialize it to ISO date string
        if (DateTime.isDateTime(parsed)) {
          return parsed.toFormat('yyyy-LL-dd');
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
          return parsed.toISO();
        }
        // otherwise (string, null, undefined) just pass it on as is
        return parsed;
      },
      parseValue: (raw: unknown) => {
        if (!isString(raw)) {
          throw new Error(`Invalid graphql time input: '${raw}'`);
        }

        return Duration.fromISO(raw);
      },
    },
  };

  const schema = buildClientSchema(
    // graphql-codegen's schema typings are off...
    introspectionResult as unknown as IntrospectionQuery,
  );

  return withScalars({ schema, typesMap });
};

const getGraphqlUrl = (isTesting: boolean, isWebsocket: boolean) => {
  const path = '/api/graphql/v1/graphql';
  if (isTesting) {
    return `http://127.0.0.1:3300${path}`;
  }
  if (isWebsocket) {
    return mapHttpToWs(`${window.location.origin}${path}`);
  }
  return path;
};

const buildWebSocketLink = () => {
  return new WebSocketLink({
    // WebSocketLink doesn't work with relative url's, so we have to
    // turn relative url into absolute.
    uri: getGraphqlUrl(false, true),
    options: {
      reconnect: true,
      // TODO: deal with authentication properly. Some possibly useful info here: https://github.com/apollographql/apollo-client/issues/3967
      connectionParams: {
        headers: roleHeaderMap(userHasuraRole),
      },
    },
  });
};

// To temporarily deal with the site giving pages without any information due to stop & start
// dependencies while developing, we can catch the access-denied error and reload the page which
// triggers userinfo check, and if user is not logged -> redirect to front page and inform
// user to log in. This can and probably should be removed after we get different user accessess.
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ extensions }) => {
      if (extensions.code === 'access-denied') {
        window.location.reload();
      }
    });
});

const buildHttpLink = (isTesting: boolean) => {
  const defaultConfig = {
    uri: getGraphqlUrl(isTesting, false),
  };

  const httpLinkConfig = isTesting
    ? {
        ...defaultConfig,
        // `fetch` is not available in test context (with jest) so we have to provide it
        // eslint-disable-next-line global-require, import/no-extraneous-dependencies
        fetch: require('cross-fetch'),
        // logging in directly as admin, only works in e2e environment
        headers: { 'x-hasura-admin-secret': 'hasura' },
      }
    : defaultConfig;
  return new HttpLink(httpLinkConfig);
};

const buildConnectionLink = (isBrowser: boolean, isTesting: boolean) => {
  // because next.js might run this on server-side and websockets aren't
  // supported there, we have to check if we are on browser before
  // initializing WebSocket link
  const httpLink = buildHttpLink(isTesting);
  if (isTesting || !isBrowser) {
    return httpLink;
  }
  const wsLink = buildWebSocketLink();
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
        fields: {
          scheduled_stop_point_in_journey_patterns: {
            merge(existing, incoming) {
              // Just return incoming contents without trying to do any merging
              // to silence console warning about defining custom merge function when
              // editing route geometry.
              // The default merge function works like this as well, but for some reason
              // defining it here silences the warning.
              // "By default, the field's existing array is completely replaced by the incoming array."
              // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-arrays
              return incoming;
            },
          },
        },
      },
      journey_pattern_scheduled_stop_point_in_journey_pattern: {
        keyFields: ['journey_pattern_id', 'scheduled_stop_point_sequence'],
      },
      journey_pattern_journey_pattern: {
        keyFields: ['journey_pattern_id'],
        fields: {
          scheduled_stop_point_in_journey_patterns: {
            merge(existing, incoming) {
              // Just return incoming contents without trying to do any merging
              // to silence console warning about defining custom merge function when
              // editing route geometry.
              // The default merge function works like this as well, but for some reason
              // defining it here silences the warning.
              // "By default, the field's existing array is completely replaced by the incoming array."
              // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#merging-arrays
              return incoming;
            },
          },
        },
      },
      route_infrastructure_link_along_route: {
        keyFields: ['route_id', 'infrastructure_link_sequence'],
      },
      infrastructure_network_infrastructure_link: {
        keyFields: ['infrastructure_link_id'],
      },
      timetables_journey_pattern_journey_pattern_ref: {
        keyFields: ['journey_pattern_ref_id'],
      },
      timetables_service_pattern_scheduled_stop_point_in_journey_pattern_ref: {
        keyFields: ['scheduled_stop_point_in_journey_pattern_ref_id'],
      },
      timetables_service_calendar_day_type: {
        keyFields: ['day_type_id'],
      },
      timetables_vehicle_schedule_vehicle_schedule_frame: {
        keyFields: ['vehicle_schedule_frame_id'],
      },
      timetables_vehicle_service_vehicle_service: {
        keyFields: ['vehicle_service_id'],
      },
      timetables_vehicle_service_block: {
        keyFields: ['block_id'],
      },
      timetables_vehicle_journey_vehicle_journey: {
        keyFields: ['vehicle_journey_id'],
      },
      timetables_timetables_query: {
        // No identifying fields here, result is cached based on query parameters.
        keyFields: [],
        fields: {
          timetables_service_calendar_substitute_operating_period: {
            merge(existing, incoming) {
              // Just return incoming contents without trying to do any merging
              // to silence console warning about defining custom merge function
              return incoming;
            },
          },
          timetables_vehicle_service_get_timetable_versions_by_journey_pattern_ids:
            {
              merge(_, incoming = []) {
                return incoming;
              },
            },
        },
      },
      timetables_passing_times_timetabled_passing_time: {
        keyFields: ['timetabled_passing_time_id'],
      },
      timing_pattern_timing_place: {
        keyFields: ['timing_place_id'],
      },
      timetables_vehicle_type_vehicle_type: {
        keyFields: ['vehicle_type_id'],
      },
      timetables_service_calendar_substitute_day_by_day_type: {
        keyFields: ['substitute_operating_day_by_line_type_id'],
      },
      timetables_service_calendar_substitute_operating_period: {
        keyFields: ['substitute_operating_period_id'],
        fields: {
          substitute_operating_day_by_line_types: {
            merge(existing, incoming) {
              // Just return incoming contents without trying to do any merging
              // to silence console warning about defining custom merge function
              return incoming;
            },
          },
        },
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
  const removeTypenameLink = removeTypenameFromVariables();

  const link = from([
    removeTypenameLink,
    errorLink,
    scalarMappingLink,
    authRoleMiddleware,
    connectionLink,
  ]);

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
