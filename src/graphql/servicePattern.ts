/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';
import {
  QueryClosestLinkQuery,
  QueryPointDirectionOnLinkQuery,
  RouteRoute,
  ServicePatternScheduledStopPoint,
  useGetStopsQuery,
} from '../generated/graphql';
import { GqlQueryResult } from './types';

const SCHEDULED_STOP_POINT_DEFAULT_FIELDS = gql`
  fragment scheduled_stop_point_default_fields on service_pattern_scheduled_stop_point {
    scheduled_stop_point_id
    label
    validity_start
    validity_end
  }
`;

const REMOVE_STOP = gql`
  mutation RemoveStop($id: uuid!) {
    delete_service_pattern_scheduled_stop_point(
      where: { scheduled_stop_point_id: { _eq: $id } }
    ) {
      returning {
        scheduled_stop_point_id
      }
    }
  }
`;

const QUERY_GET_ALL_STOPS = gql`
  query GetStops {
    service_pattern_scheduled_stop_point {
      closest_point_on_infrastructure_link
      direction
      label
      located_on_infrastructure_link_id
      measured_location
      priority
      relative_distance_from_infrastructure_link_start
      scheduled_stop_point_id
      validity_end
      validity_start
    }
  }
`;
export const mapGetStopsResult = (
  result: ReturnType<typeof useGetStopsQuery>,
) =>
  result.data?.service_pattern_scheduled_stop_point as
    | ServicePatternScheduledStopPoint[]
    | undefined;

const INSERT_STOP = gql`
  mutation InsertStop(
    $object: service_pattern_scheduled_stop_point_insert_input!
  ) {
    insert_service_pattern_scheduled_stop_point_one(object: $object) {
      scheduled_stop_point_id
      located_on_infrastructure_link_id
      direction
      priority
      measured_location
      label
      validity_start
      validity_end
    }
  }
`;

export const mapClosestLinkResult = (
  result: GqlQueryResult<QueryClosestLinkQuery>,
) =>
  result.data?.infrastructure_network_resolve_point_to_closest_link?.[0]
    ?.infrastructure_link_id as UUID | undefined;

export const mapGetPointDirectionOnLinkResult = (
  result: GqlQueryResult<QueryPointDirectionOnLinkQuery>,
) =>
  result.data?.infrastructure_network_find_point_direction_on_link?.[0]
    ?.value as string | undefined;

export const getStopsAlongRouteGeometry = (route: RouteRoute) => {
  return route.infrastructure_links_along_route.flatMap(
    (infraLink) =>
      infraLink.infrastructure_link
        .scheduled_stop_point_located_on_infrastructure_link,
  );
};
