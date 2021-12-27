/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';

/*
 * Define graphql queries here and then `@graphql-codegen` can generate TypeScript code for those.
 */

const QUERY_CLOSEST_LINK = gql`
  query QueryClosestLink($point: geography) {
    infrastructure_network_resolve_point_to_closest_link(
      args: { geog: $point }
    ) {
      infrastructure_link_id
    }
  }
`;

const QUERY_POINT_DIRECTION = gql`
  query QueryPointDirectionOnLink(
    $point_of_interest: geography
    $infrastructure_link_uuid: uuid
    $point_max_distance_in_meters: float8
  ) {
    infrastructure_network_find_point_direction_on_link(
      args: {
        point_of_interest: $point_of_interest
        infrastructure_link_uuid: $infrastructure_link_uuid
        point_max_distance_in_meters: $point_max_distance_in_meters
      }
    ) {
      value
    }
  }
`;

const LIST_ALL_LINES = gql`
  query ListAllLines {
    route_line {
      line_id
      name_i18n
      short_name_i18n
      description_i18n
      primary_vehicle_mode
    }
  }
`;

const QUERY_MAP_EXTERNAL_LINK_IDS_TO_INFRA_LINK_IDS = gql`
  query MapExternalLinkIdsToInfraLinkIds($externalLinkIds: [String!]) {
    infrastructure_network_infrastructure_link(
      where: { external_link_id: { _in: $externalLinkIds } }
    ) {
      infrastructure_link_id
      external_link_id
    }
  }
`;

const QUERY_GET_STOPS = gql`
  query GetStopsByInfraLinkIds($infraLinkIds: [uuid!]) {
    service_pattern_scheduled_stop_point(
      where: { located_on_infrastructure_link_id: { _in: $infraLinkIds } }
    ) {
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
