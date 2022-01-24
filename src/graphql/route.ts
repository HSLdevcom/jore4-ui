/* eslint-disable @typescript-eslint/no-unused-vars */
import { FetchResult, gql } from '@apollo/client';
import {
  InsertLineOneMutation,
  RouteLine,
  RouteRoute,
  useGetLineDetailsByIdQuery,
  useGetRouteDetailsByIdQuery,
  useListChangingRoutesQuery,
} from '../generated/graphql';

const LINE_DEFAULT_FIELDS = gql`
  fragment line_default_fields on route_line {
    line_id
    name_i18n
    short_name_i18n
    description_i18n
  }
`;

const LINE_ALL_FIELDS = gql`
  fragment line_all_fields on route_line {
    line_id
    name_i18n
    short_name_i18n
    description_i18n
    primary_vehicle_mode
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
  }
`;

const LIST_ALL_LINES = gql`
  query ListAllLines {
    route_line {
      ...line_default_fields
    }
  }
`;

// TODO this will list all routes for now
const LIST_CHANGING_ROUTES = gql`
  query ListChangingRoutes {
    route_route {
      ...route_default_fields
      route_line {
        ...line_default_fields
      }
      starts_from_scheduled_stop_point {
        ...scheduled_stop_point_default_fields
      }
      ends_at_scheduled_stop_point {
        ...scheduled_stop_point_default_fields
      }
    }
  }
`;
export const mapListChangingRoutesResult = (
  result: ReturnType<typeof useListChangingRoutesQuery>,
) => result.data?.route_route as RouteRoute[] | undefined;

const GET_LINE_DETAILS_BY_ID = gql`
  query GetLineDetailsById($line_id: uuid!) {
    route_line(where: { line_id: { _eq: $line_id } }) {
      ...line_all_fields
    }
  }
`;
export const mapLineDetailsResult = (
  result: ReturnType<typeof useGetLineDetailsByIdQuery>,
) => result.data?.route_line[0] as RouteLine | undefined;

const GET_ROUTE_DETAILS_BY_ID = gql`
  query GetRouteDetailsById($route_id: uuid!) {
    route_route(where: { route_id: { _eq: $route_id } }) {
      ...route_all_fields
    }
  }
`;
export const mapRouteDetailsResult = (
  result: ReturnType<typeof useGetRouteDetailsByIdQuery>,
) => result.data?.route_route[0] as RouteRoute | undefined;

const INSERT_LINE = gql`
  mutation InsertLineOne($object: route_line_insert_input!) {
    insert_route_line_one(object: $object) {
      line_id
      label
      priority
      primary_vehicle_mode
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
