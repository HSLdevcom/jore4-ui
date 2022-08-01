/* eslint-disable @typescript-eslint/no-unused-vars */
import { FetchResult, gql } from '@apollo/client';
import {
  GetCurrentOrFutureLinesByLabelQuery,
  GetHighestPriorityLineDetailsWithRoutesQuery,
  GetLineDetailsByIdQuery,
  GetLineDetailsWithRoutesByIdQuery,
  GetLineValidityPeriodByIdQuery,
  InsertLineOneMutation,
  JourneyPatternScheduledStopPointInJourneyPattern,
  RouteLine,
  RouteRoute,
  ServicePatternScheduledStopPoint,
  useListOwnLinesQuery,
  useSearchLinesAndRoutesQuery,
} from '../generated/graphql';
import { RouteInfraLink } from './infrastructureNetwork';
import { GqlQueryResult } from './types';

const LINE_DEFAULT_FIELDS = gql`
  fragment line_default_fields on route_line {
    line_id
    label
    name_i18n
    short_name_i18n
    validity_start
    validity_end
  }
`;

const LINE_ALL_FIELDS = gql`
  fragment line_all_fields on route_line {
    line_id
    name_i18n
    short_name_i18n
    primary_vehicle_mode
    type_of_line
    transport_target
    validity_start
    validity_end
    priority
    label
  }
`;

const ROUTE_ALL_FIELDS = gql`
  fragment route_all_fields on route_route {
    route_id
    name_i18n
    description_i18n
    origin_name_i18n
    origin_short_name_i18n
    destination_name_i18n
    destination_short_name_i18n
    route_shape
    on_line_id
    validity_start
    validity_end
    priority
    label
    direction
  }
`;

const ROUTE_DEFAULT_FIELDS = gql`
  fragment route_default_fields on route_route {
    route_id
    name_i18n
    description_i18n
    origin_name_i18n
    origin_short_name_i18n
    destination_name_i18n
    destination_short_name_i18n
    on_line_id
    label
    priority
  }
`;

const ROUTE_WITH_JOURNEY_PATTERN_STOPS = gql`
  fragment route_with_journey_pattern_stops on route_route {
    ...route_all_fields
    route_journey_patterns {
      ...journey_pattern_with_stops
    }
  }
`;

const ROUTES_WITH_INFRASTRUCTURE_LINKS = gql`
  fragment route_with_infrastructure_links on route_route {
    ...route_with_journey_pattern_stops
    route_line {
      line_id
      label
    }
    infrastructure_links_along_route {
      route_id
      infrastructure_link_sequence
      infrastructure_link_id
      infrastructure_link {
        infrastructure_link_id
        shape
      }
      is_traversal_forwards
    }
  }
`;

const SEARCH_LINES_AND_ROUTES = gql`
  query SearchLinesAndRoutes(
    $lineFilter: route_line_bool_exp
    $routeFilter: route_route_bool_exp
    $lineOrderBy: [route_line_order_by!]
    $routeOrderBy: [route_route_order_by!]
  ) {
    route_line(where: $lineFilter, order_by: $lineOrderBy) {
      ...line_all_fields
    }
    route_route(where: $routeFilter, order_by: $routeOrderBy) {
      ...route_all_fields
    }
  }
`;
export const mapSearchLinesAndRoutesResult = (
  result: ReturnType<typeof useSearchLinesAndRoutesQuery>,
) => ({
  lines: (result.data?.route_line || []) as RouteLine[],
  routes: (result.data?.route_route || []) as RouteRoute[],
});

// TODO this is just listing all lines for now
const LIST_OWN_LINES = gql`
  query ListOwnLines($limit: Int = 10) {
    route_line(
      limit: $limit
      order_by: [{ label: asc }, { validity_start: asc }]
    ) {
      ...line_all_fields
      line_routes {
        route_id
      }
    }
  }
`;
export const mapListOwnLinesResult = (
  result: ReturnType<typeof useListOwnLinesQuery>,
) => result.data?.route_line as RouteLine[];

// TODO this will list all routes for now
const LIST_CHANGING_ROUTES = gql`
  query ListChangingRoutes($limit: Int) {
    route_route(
      limit: $limit
      order_by: [{ label: asc }, { validity_start: asc }]
    ) {
      ...route_all_fields
      route_line {
        ...line_default_fields
      }
    }
  }
`;

const GET_LINE_DETAILS_BY_ID = gql`
  query GetLineDetailsById($line_id: uuid!) {
    route_line_by_pk(line_id: $line_id) {
      ...line_all_fields
    }
  }
`;
export const mapLineDetailsResult = (
  result: GqlQueryResult<GetLineDetailsByIdQuery>,
) => result.data?.route_line_by_pk as RouteLine | undefined;

const GET_LINE_VALIDITY_PERIOD_BY_ID = gql`
  query GetLineValidityPeriodById($line_id: uuid!) {
    route_line_by_pk(line_id: $line_id) {
      line_id
      validity_start
      validity_end
    }
  }
`;

export const mapLineValidityPeriod = (
  result: GqlQueryResult<GetLineValidityPeriodByIdQuery>,
) => result.data?.route_line_by_pk as RouteLine | undefined;

const GET_LINES_BY_VALIDITY = gql`
  query GetLinesByValidity($filter: route_line_bool_exp) {
    route_line(where: $filter) {
      ...line_all_fields
    }
  }
`;

const GET_LINE_DETAILS_WITH_ROUTES_BY_ID = gql`
  query GetLineDetailsWithRoutesById($line_id: uuid!) {
    route_line_by_pk(line_id: $line_id) {
      ...line_all_fields
      line_routes {
        ...route_all_fields
        infrastructure_links_along_route {
          route_id
          infrastructure_link_id
          infrastructure_link_sequence
          is_traversal_forwards
          infrastructure_link {
            infrastructure_link_id
            scheduled_stop_points_located_on_infrastructure_link {
              ...scheduled_stop_point_all_fields
              scheduled_stop_point_in_journey_patterns {
                ...scheduled_stop_point_in_journey_pattern_all_fields
                journey_pattern {
                  journey_pattern_id
                  on_route_id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const mapLineDetailsWithRoutesResult = (
  result: GqlQueryResult<GetLineDetailsWithRoutesByIdQuery>,
) => result.data?.route_line_by_pk as RouteLine | undefined;

const GET_HIGHEST_PRIORITY_LINE_DETAILS_WITH_ROUTES = gql`
  query GetHighestPriorityLineDetailsWithRoutes(
    $lineFilters: route_line_bool_exp
    $lineRouteFilters: route_route_bool_exp
    $routeStopFilters: service_pattern_scheduled_stop_point_bool_exp
  ) {
    route_line(where: $lineFilters, order_by: { priority: desc }, limit: 1) {
      ...line_all_fields
      line_routes(where: $lineRouteFilters) {
        ...route_all_fields
        infrastructure_links_along_route {
          route_id
          infrastructure_link_id
          infrastructure_link_sequence
          is_traversal_forwards
          infrastructure_link {
            infrastructure_link_id
            scheduled_stop_points_located_on_infrastructure_link(
              where: $routeStopFilters
            ) {
              ...scheduled_stop_point_all_fields
              scheduled_stop_point_in_journey_patterns {
                ...scheduled_stop_point_in_journey_pattern_all_fields
                journey_pattern {
                  journey_pattern_id
                  on_route_id
                }
              }
            }
          }
        }
      }
    }
  }
`;

// The used query has limit: 1 for the result so it can't have more than 1 route_line in result array.
export const mapHighestPriorityLineDetailsWithRoutesResult = (
  result: GqlQueryResult<GetHighestPriorityLineDetailsWithRoutesQuery>,
) =>
  result.data?.route_line.length
    ? (result.data?.route_line[0] as RouteLine)
    : undefined;

const GET_ROUTES_WITH_STOPS = gql`
  query GetRoutesWithStops($routeFilters: route_route_bool_exp) {
    route_route(where: $routeFilters) {
      ...route_all_fields
      route_line {
        line_id
      }
      infrastructure_links_along_route {
        route_id
        infrastructure_link_id
        infrastructure_link_sequence
        is_traversal_forwards
        infrastructure_link {
          infrastructure_link_id
          scheduled_stop_points_located_on_infrastructure_link {
            ...scheduled_stop_point_all_fields
            scheduled_stop_point_in_journey_patterns {
              ...scheduled_stop_point_in_journey_pattern_all_fields
              journey_pattern {
                journey_pattern_id
                on_route_id
              }
            }
          }
        }
      }
    }
  }
`;

const GET_ROUTE_DETAILS_BY_ID = gql`
  query GetRouteDetailsById($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      ...route_with_journey_pattern_stops
      route_line {
        ...line_all_fields
      }
    }
  }
`;

const GET_ROUTE_DETAILS_BY_IDS = gql`
  query GetRouteDetailsByIds($route_ids: [uuid!]) {
    route_route(where: { route_id: { _in: $route_ids } }) {
      ...route_with_journey_pattern_stops
      route_line {
        line_id
        label
        primary_vehicle_mode
      }
    }
  }
`;

const GET_ROUTE_RENDER_INFO_BY_ID = gql`
  query GetRouteRenderInfoById($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      route_id
      route_shape
      route_line {
        line_id
        primary_vehicle_mode
      }
    }
  }
`;

const GET_ROUTE_DETAILS_BY_LABELS = gql`
  query GetRouteDetailsByLabels($labels: [String!], $date: timestamptz) {
    route_route(
      where: {
        label: { _in: $labels }
        validity_start: { _lte: $date }
        _or: [
          { validity_end: { _gte: $date } }
          { validity_end: { _is_null: true } }
        ]
      }
    ) {
      ...route_with_journey_pattern_stops
      route_line {
        line_id
        label
        primary_vehicle_mode
      }
    }
  }
`;

const GET_ROUTE_DETAILS_BY_LABEL_WILDCARD = gql`
  query GetRouteDetailsByLabelWildcard(
    $label: String!
    $date: timestamptz
    $priorities: [Int!]
  ) {
    route_route(
      where: {
        label: { _ilike: $label }
        validity_start: { _lte: $date }
        _or: [
          { validity_end: { _gte: $date } }
          { validity_end: { _is_null: true } }
        ]
        priority: { _in: $priorities }
      }
    ) {
      ...route_all_fields
    }
  }
`;

const GET_CURRENT_OR_FUTURE_LINES_BY_LABEL = gql`
  query GetCurrentOrFutureLinesByLabel($label: String!, $date: timestamptz!) {
    route_line(
      where: {
        label: { _ilike: $label }
        _or: [
          { validity_end: { _gte: $date } }
          { validity_end: { _is_null: true } }
        ]
      }
      order_by: [{ label: asc }, { validity_start: asc }]
    ) {
      ...line_all_fields
    }
  }
`;

export const mapCurrentOrFutureLinesResult = (
  result: GqlQueryResult<GetCurrentOrFutureLinesByLabelQuery>,
) => result.data?.route_line as RouteLine[] | undefined;

const GET_ROUTES_WITH_INFRASTRUCTURE_LINKS = gql`
  query GetRoutesWithInfrastructureLinks($route_ids: [uuid!]) {
    route_route(where: { route_id: { _in: $route_ids } }) {
      ...route_with_infrastructure_links
    }
  }
`;

const GET_ROUTES_BY_VALIDITY = gql`
  query GetRoutesByValidity($filter: route_route_bool_exp) {
    route_route(where: $filter) {
      ...route_default_fields
      validity_start
      validity_end
    }
  }
`;

const INSERT_LINE = gql`
  mutation InsertLineOne($object: route_line_insert_input!) {
    insert_route_line_one(object: $object) {
      line_id
      label
      priority
      primary_vehicle_mode
      transport_target
      validity_start
      validity_end
    }
  }
`;

export const mapInsertLineOneResult = (
  result: FetchResult<
    InsertLineOneMutation,
    Record<string, ExplicitAny>,
    Record<string, ExplicitAny>
  >,
) => result.data?.insert_route_line_one as RouteLine | undefined;

const UPDATE_LINE = gql`
  mutation PatchLine($line_id: uuid!, $object: route_line_set_input!) {
    update_route_line_by_pk(pk_columns: { line_id: $line_id }, _set: $object) {
      ...line_all_fields
    }
  }
`;

const INSERT_ROUTE = gql`
  mutation InsertRouteOne($object: route_route_insert_input!) {
    insert_route_route_one(object: $object) {
      ...route_all_fields
    }
  }
`;

const UPDATE_ROUTE = gql`
  mutation PatchRoute($route_id: uuid!, $object: route_route_set_input!) {
    update_route_route(where: { route_id: { _eq: $route_id } }, _set: $object) {
      returning {
        ...route_all_fields
      }
    }
  }
`;

const UPDATE_ROUTE_GEOMETRY = gql`
  mutation UpdateRouteGeometry(
    $route_id: uuid!
    $new_infrastructure_links: [route_infrastructure_link_along_route_insert_input!]!
    $new_journey_pattern: journey_pattern_journey_pattern_insert_input!
  ) {
    delete_route_infrastructure_link_along_route(
      where: { route_id: { _eq: $route_id } }
    ) {
      returning {
        infrastructure_link_id
        infrastructure_link_sequence
        route_id
      }
    }

    insert_route_infrastructure_link_along_route(
      objects: $new_infrastructure_links
    ) {
      returning {
        route_id
        infrastructure_link_id
        infrastructure_link_sequence
        infrastructure_link {
          infrastructure_link_id
          shape
        }
        is_traversal_forwards
      }
    }

    delete_journey_pattern_journey_pattern(
      where: { on_route_id: { _eq: $route_id } }
    ) {
      returning {
        journey_pattern_id
        on_route_id
      }
    }

    insert_journey_pattern_journey_pattern_one(object: $new_journey_pattern) {
      ...journey_pattern_with_stops
    }
  }
`;

const DELETE_ROUTE = gql`
  mutation DeleteRoute($route_id: uuid!) {
    delete_route_route(where: { route_id: { _eq: $route_id } }) {
      returning {
        route_id
      }
    }
  }
`;

export const getStopsFromRoute = (route: RouteRoute) => {
  return route.route_journey_patterns[0]
    .scheduled_stop_point_in_journey_patterns;
};

export const getRouteStopLabels = (route: RouteRoute) => {
  return getStopsFromRoute(route).map(
    (point) => point.scheduled_stop_point_label,
  );
};

export interface RouteGeometry {
  routeStops: RouteStop[];
  infraLinksAlongRoute: RouteInfraLink[];
}

/**
 * An interface containing a stop along route's geometry.
 * We need a type like this, because for example in route creation
 * we want to have a list of all the stops that are along the route geometry
 * with also the info if they are selected to the journey pattern or not.
 */
export interface RouteStop {
  /**
   * Label of the route
   */
  label: string;
  /**
   * Is this route selected to the route's journey pattern
   */
  belongsToJourneyPattern: boolean;
  /**
   * Metadata (e.g. via point informaiton) of the stop in journey pattern
   */
  stop?: JourneyPatternScheduledStopPointInJourneyPattern;
  scheduledStopPointId?: UUID;
}

/**
 * Maps a RouteStop object to a stop in journey pattern that can be used when
 * creating/updating route's journey pattern in GraphQL
 * @param routeStop A stop along route's geometry
 * @param index Stop's index on journey pattern
 * @returns Stop in journey pattern
 */
const mapRouteStopToStopInSequence = (routeStop: RouteStop, index: number) => {
  const { stop } = routeStop;
  return {
    is_timing_point: stop?.is_timing_point || false,
    is_via_point: stop?.is_via_point || false,
    via_point_name_i18n: stop?.via_point_name_i18n,
    via_point_short_name_i18n: stop?.via_point_short_name_i18n,
    scheduled_stop_point_label: routeStop.label,
    scheduled_stop_point_sequence: index,
  };
};

/**
 * Maps a list of RouteStop objects to a list of stops in journey pattern,
 * can be used when creating/updating route's journey pattern in GraphQL
 * @param stops Stops along route's geometry
 * @returns Sequence of stops that belong to route's journey pattern
 */
export const mapRouteStopsToStopSequence = (stops: RouteStop[]) => {
  return {
    data: stops
      .filter((routeStop) => routeStop.belongsToJourneyPattern)
      .map(mapRouteStopToStopInSequence),
  };
};

/**
 * Maps a ServicePatternScheduledStopPoint to RouteStop.
 * Gets metadata related to stop in journey pattern from the stop object.
 * @param stop Stop to be mapped
 * @param belongsToJourneyPattern Does the stop belong to the route's journey pattern
 * @param routeId Id of the route in relation to which this stop is being handled
 * @returns RouteStop
 */
export const mapStopToRouteStop = (
  stop: ServicePatternScheduledStopPoint,
  belongsToJourneyPattern: boolean,
  routeId?: UUID,
): RouteStop => {
  const stopInJourneyPattern =
    stop.scheduled_stop_point_in_journey_patterns?.find(
      (stopInRoute) => stopInRoute.journey_pattern.on_route_id === routeId,
    );

  return {
    label: stop.label,
    belongsToJourneyPattern,
    stop: stopInJourneyPattern,
    scheduledStopPointId: stop.scheduled_stop_point_id,
  };
};
