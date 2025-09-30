/* eslint-disable @typescript-eslint/no-unused-vars */
import { FetchResult, gql } from '@apollo/client';
import {
  GetLineDetailsByIdQuery,
  GetLineValidityPeriodByIdQuery,
  GetScheduledStopsOnRouteQuery,
  InsertLineOneMutation,
  RouteLine,
  RouteRoute,
  RouteWithJourneyPatternStopsFragment,
  ServicePatternScheduledStopPoint,
} from '../generated/graphql';
import { GqlQueryResult, isGqlEntity } from './types';

const LINE_DEFAULT_FIELDS = gql`
  fragment line_default_fields on route_line {
    line_id
    label
    description
    name_i18n
    short_name_i18n
    validity_start
    validity_end
    priority
  }
`;

const LINE_ALL_FIELDS = gql`
  fragment line_all_fields on route_line {
    ...line_default_fields
    primary_vehicle_mode
    type_of_line
    transport_target
  }
`;

const ROUTE_VALIDITY = gql`
  fragment route_validity on route_route {
    validity_start
    validity_end
    priority
  }
`;

const GQL_ROUTE_UNIQUE_FIELDS_FRAGMENT = gql`
  fragment route_unique_fields on route_route {
    ...route_validity
    label
    direction
    variant
    route_id
  }
`;

const ROUTE_ALL_FIELDS = gql`
  fragment route_all_fields on route_route {
    ...route_default_fields
    route_shape
  }
`;

const ROUTE_DEFAULT_FIELDS = gql`
  fragment route_default_fields on route_route {
    ...route_unique_fields
    name_i18n
    description_i18n
    origin_name_i18n
    origin_short_name_i18n
    destination_name_i18n
    destination_short_name_i18n
    on_line_id
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
    ...route_all_fields
    route_line {
      ...line_all_fields
    }
    infrastructure_links_along_route {
      route_id
      infrastructure_link_sequence
      infrastructure_link_id
      infrastructure_link {
        infrastructure_link_id
        shape
        direction
        external_link_id
        external_link_source
      }
      is_traversal_forwards
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
              other_label_instances {
                ...scheduled_stop_point_default_fields
              }
            }
          }
        }
      }
    }
  }
`;

const GET_ROUTES_WITH_STOPS = gql`
  query GetRoutesWithStops($routeFilters: route_route_bool_exp) {
    route_route(where: $routeFilters) {
      ...route_with_infrastructure_links_with_stops_and_jps
    }
  }
`;

const GET_ROUTE_DETAILS_BY_ID = gql`
  query GetRouteDetailsById($routeId: uuid!) {
    route_route_by_pk(route_id: $routeId) {
      ...route_with_infrastructure_links_with_stops_and_jps
    }
  }
`;

const GET_ROUTE_DETAILS_BY_IDS = gql`
  query GetRouteDetailsByIds($route_ids: [uuid!]) {
    route_route(where: { route_id: { _in: $route_ids } }) {
      ...route_with_infrastructure_links_with_stops_and_jps
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
  query GetRouteDetailsByLabels($labels: [String!], $date: date) {
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
    }
  }
`;

const INSERT_LINE = gql`
  mutation InsertLineOne($object: route_line_insert_input!) {
    insert_route_line_one(object: $object) {
      ...line_all_fields
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

const DELETE_ROUTE = gql`
  mutation DeleteRoute($route_id: uuid!) {
    delete_route_route(where: { route_id: { _eq: $route_id } }) {
      returning {
        route_id
      }
    }
  }
`;

const GET_SCHEDULED_STOPS_ON_ROUTE = gql`
  query GetScheduledStopsOnRoute($routeId: uuid!) {
    journey_pattern_journey_pattern(where: { on_route_id: { _eq: $routeId } }) {
      journey_pattern_id
      scheduled_stop_point_in_journey_patterns {
        journey_pattern_id
        scheduled_stop_point_sequence
        scheduled_stop_points {
          ...scheduled_stop_point_default_fields
        }
      }
    }
  }
`;

// Used query has limit of 1 journey_pattern_journey_pattern because one route can have a maximum of one journey pattern
export const mapScheduledStopsOnRoute = (
  result: GqlQueryResult<GetScheduledStopsOnRouteQuery>,
) =>
  result.data?.journey_pattern_journey_pattern[0]?.scheduled_stop_point_in_journey_patterns.flatMap(
    (item) => item.scheduled_stop_points,
  ) as ServicePatternScheduledStopPoint[] | undefined;

export const getStopsFromRoute = (route: RouteRoute) => {
  return route.route_journey_patterns[0]
    .scheduled_stop_point_in_journey_patterns;
};

export const getRouteStopLabels = (
  route: RouteWithJourneyPatternStopsFragment,
) => {
  return route.route_journey_patterns[0].ordered_scheduled_stop_point_in_journey_patterns.map(
    (point) => point.scheduled_stop_point_label,
  );
};

export const isRoute = (
  input: unknown,
): input is Pick<RouteRoute, '__typename'> => {
  // eslint-disable-next-line no-underscore-dangle
  return isGqlEntity(input) && input.__typename === 'route_route';
};

export const isLine = (
  input: unknown,
): input is Pick<RouteLine, '__typename'> => {
  // eslint-disable-next-line no-underscore-dangle
  return isGqlEntity(input) && input.__typename === 'route_line';
};
