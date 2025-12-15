import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  UriFunction,
  from,
  split,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { ParsingFunctionsObject, withScalars } from 'apollo-link-scalars';
import { FunctionsMap } from 'apollo-link-scalars/src/types/functions-map';
import { IntrospectionQuery, buildClientSchema } from 'graphql';
import { createClient as createWsClient } from 'graphql-ws';
import isString from 'lodash/isString';
import { DateTime, Duration } from 'luxon';
import introspectionResult from '../../graphql.schema.json';
import { isDateLike, parseDate } from '../time';
import { mapHttpToWs } from '../utils/url';
import { authRoleMiddleware, roleHeaderMap, userHasuraRole } from './auth';

function parseDateTime(raw: unknown) {
  if (!isDateLike(raw)) {
    throw new Error(`Invalid graphql date input: '${raw}'`);
  }

  return parseDate(raw);
}

const buildScalarMappingLink = () => {
  const dateTimeMapper: ParsingFunctionsObject<DateTime, unknown> = {
    serialize: (parsed: unknown) => {
      if (DateTime.isDateTime(parsed)) {
        return parsed.toISO({ includeOffset: true });
      }

      return parsed;
    },

    parseValue: parseDateTime,
  };

  const typesMap: FunctionsMap = {
    // automatically (de)serializing between graphql date <-> luxon.DateTime types
    date: {
      serialize: (parsed: unknown) => {
        // if it's a luxon DateTime, serialize it to ISO date string
        if (DateTime.isDateTime(parsed)) {
          return parsed.toISODate();
        }
        // otherwise (string, null, undefined) just pass it on as is
        return parsed;
      },
      parseValue: parseDateTime,
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
    stop_registry_DateTime: dateTimeMapper,
    timetamptz: dateTimeMapper,
  };

  const schema = buildClientSchema(
    // graphql-codegen's schema typings are off...
    introspectionResult as unknown as IntrospectionQuery,
  );

  return withScalars({ schema, typesMap });
};

function getGraphqlUrl(
  isTesting: boolean,
  isWebsocket: false,
): string | UriFunction;
function getGraphqlUrl(isTesting: boolean, isWebsocket: true): string;
function getGraphqlUrl(
  isTesting: boolean,
  isWebsocket: boolean,
): string | UriFunction {
  const path = '/api/graphql/v1/graphql';

  if (isTesting) {
    // In CI or when HASURA_URL is set, use it directly
    // Otherwise default to UI proxy for local development
    return process.env.HASURA_URL ?? `http://127.0.0.1:3300${path}`;
  }

  if (isWebsocket) {
    return mapHttpToWs(`${window.location.origin}${path}`);
  }

  return (operation) => `${path}?q=${operation.operationName}`;
}

const buildWebSocketLink = () => {
  return new GraphQLWsLink(
    createWsClient({
      url: getGraphqlUrl(false, true),
      connectionParams: {
        headers: roleHeaderMap(userHasuraRole),
      },
      lazy: true,
    }),
  );
};

// To temporarily deal with the site giving pages without any information due to stop & start
// dependencies while developing, we can catch the access-denied error and reload the page which
// triggers userinfo check, and if user is not logged -> redirect to front page and inform
// user to log in. This can and probably should be removed after we get different user accessess.
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ extensions }) => {
      if (extensions?.code === 'access-denied') {
        window.location.reload();
      }
    });
  }
});

const buildHttpLink = (isTesting: boolean) => {
  const defaultConfig = {
    uri: getGraphqlUrl(isTesting, false),
  };

  const httpLinkConfig = isTesting
    ? {
        ...defaultConfig,
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
      // "Nested ROOT QUERY" of stops_database
      stops_database_stops_database_query: {
        merge: true,
      },
      group_of_stop_places_alternative_names: {
        keyFields: ['group_of_stop_places_id', 'alternative_names_id'],
      },
      stop_registry_externalLink: { keyFields: ['quayId', 'orderNum'] },
      group_of_stop_places_members: {
        keyFields: ['group_of_stop_places_id', 'ref', 'version'],
      },
      stops_database_stop_place_children: {
        keyFields: ['stop_place_id', 'children_id'],
      },
      stops_database_quay_newest_version: {
        keyFields: ['netex_id'],
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

  const link = from([
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
