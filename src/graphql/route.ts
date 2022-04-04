/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloQueryResult, FetchResult, gql } from '@apollo/client';
import {
  GetLineDetailsWithRoutesByIdQuery,
  GetRouteDetailsByIdsQuery,
  InsertLineOneMutation,
  RouteLine,
  RouteRoute,
  useGetLineDetailsByIdQuery,
  useGetRouteDetailsByIdsQuery,
  useGetRouteDetailsByLabelWildcardQuery,
  useGetRoutesWithInfrastructureLinksQuery,
  useListChangingRoutesQuery,
  useListOwnLinesQuery,
  useSearchAllLinesQuery,
} from '../generated/graphql';
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
    validity_start
    validity_end
    priority
    label
  }
`;

const ROUTE_ALL_FIELDS = gql`
  fragment route_all_fields on route_route {
    route_id
    description_i18n
    starts_from_scheduled_stop_point_id
    ends_at_scheduled_stop_point_id
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
    description_i18n
    on_line_id
    label
    starts_from_scheduled_stop_point_id
    ends_at_scheduled_stop_point_id
  }
`;

const ROUTE_WITH_STOPS = gql`
  fragment route_with_stops on route_route {
    ...route_all_fields
    starts_from_scheduled_stop_point {
      ...scheduled_stop_point_default_fields
    }
    ends_at_scheduled_stop_point {
      ...scheduled_stop_point_default_fields
    }
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
      label
    }
    infrastructure_links_along_route {
      infrastructure_link_id
      infrastructure_link {
        shape
      }
      is_traversal_forwards
    }
  }
`;

const LIST_ALL_LINES = gql`
  query ListAllLines {
    route_line {
      ...line_default_fields
    }
  }
`;

const SEARCH_ALL_LINES = gql`
  query SearchAllLines($filter: route_line_bool_exp) {
    route_line(where: $filter) {
      ...line_default_fields
      line_routes {
        ...route_all_fields
      }
    }
  }
`;
export const mapSearchAllLinesResult = (
  result: ReturnType<typeof useSearchAllLinesQuery>,
) => result.data?.route_line as RouteLine[];

// TODO this is just listing all lines for now
const LIST_OWN_LINES = gql`
  query ListOwnLines {
    route_line {
      ...line_default_fields
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
  query ListChangingRoutes {
    route_route {
      ...route_with_stops
      route_line {
        ...line_default_fields
      }
    }
  }
`;
export const mapListChangingRoutesResult = (
  result: ReturnType<typeof useListChangingRoutesQuery>,
) => result.data?.route_route as RouteRoute[] | undefined;

const GET_LINE_DETAILS_BY_ID = gql`
  query GetLineDetailsById($line_id: uuid!) {
    route_line_by_pk(line_id: $line_id) {
      ...line_all_fields
    }
  }
`;
export const mapLineDetailsResult = (
  result: ReturnType<typeof useGetLineDetailsByIdQuery>,
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
        ...route_with_stops
        infrastructure_links_along_route {
          infrastructure_link {
            scheduled_stop_point_located_on_infrastructure_link {
              ...scheduled_stop_point_default_fields
              scheduled_stop_point_in_journey_patterns {
                ...scheduled_stop_point_in_journey_pattern_default_fields
                journey_pattern {
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

const GET_ROUTE_DETAILS_BY_IDS = gql`
  query GetRouteDetailsByIds($route_ids: [uuid!]) {
    route_route(where: { route_id: { _in: $route_ids } }) {
      ...route_with_journey_pattern_stops
      route_line {
        label
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
        label
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
        label: { _like: $label }
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

export const mapRouteDetailsResult = (
  result: ReturnType<typeof useGetRouteDetailsByIdsQuery>,
) => result.data?.route_route[0] as RouteRoute | undefined;

export const mapRoutesDetailsResult = (
  result:
    | ApolloQueryResult<GetRouteDetailsByIdsQuery>
    | ReturnType<typeof useGetRoutesWithInfrastructureLinksQuery>
    | ReturnType<typeof useGetRouteDetailsByLabelWildcardQuery>
    | ReturnType<typeof useGetRouteDetailsByIdsQuery>,
) => result.data?.route_route as RouteRoute[] | [];

const GET_ROUTES_WITH_INFRASTRUCTURE_LINKS = gql`
  query GetRoutesWithInfrastructureLinks($route_ids: [uuid!]) {
    route_route(where: { route_id: { _in: $route_ids } }) {
      ...route_with_infrastructure_links
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
      route_id
      starts_from_scheduled_stop_point_id
      ends_at_scheduled_stop_point_id
      route_shape
      on_line_id
      priority
      validity_start
      validity_end
      label
      direction
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
    $route_route: route_route_set_input!
  ) {
    delete_route_infrastructure_link_along_route(
      where: { route_id: { _eq: $route_id } }
    ) {
      returning {
        route_id
      }
    }

    insert_route_infrastructure_link_along_route(
      objects: $new_infrastructure_links
    ) {
      returning {
        route_id
        infrastructure_link_id
        infrastructure_link {
          shape
        }
        is_traversal_forwards
      }
    }

    delete_journey_pattern_journey_pattern(
      where: { on_route_id: { _eq: $route_id } }
    ) {
      returning {
        on_route_id
      }
    }

    insert_journey_pattern_journey_pattern_one(object: $new_journey_pattern) {
      on_route_id
    }

    update_route_route(
      where: { route_id: { _eq: $route_id } }
      _set: $route_route
    ) {
      returning {
        ...route_with_infrastructure_links
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

const DELETE_STOP_FROM_JOURNEY_PATTERN = gql`
  mutation DeleteStopFromJourneyPattern(
    $route_id: uuid!
    $scheduled_stop_point_id: uuid!
  ) {
    delete_journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        _and: {
          journey_pattern: { on_route_id: { _eq: $route_id } }
          scheduled_stop_point_id: { _eq: $scheduled_stop_point_id }
        }
      }
    ) {
      returning {
        journey_pattern {
          ...journey_pattern_with_stops
        }
      }
    }
  }
`;

export const getRouteStopIds = (route: RouteRoute) => {
  return route.route_journey_patterns[0].scheduled_stop_point_in_journey_patterns.map(
    (point) => point.scheduled_stop_point_id,
  );
};
