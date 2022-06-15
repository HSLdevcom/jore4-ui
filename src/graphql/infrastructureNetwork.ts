/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql } from '@apollo/client';
import { Geometry } from '../components/map/mapUtils';
import {
  InfrastructureNetworkDirectionEnum,
  InfrastructureNetworkInfrastructureLink,
  MapExternalLinkIdsToInfraLinksWithStopsQuery,
  QueryClosestLinkQuery,
  QueryPointDirectionOnLinkQuery,
  RouteRoute,
} from '../generated/graphql';
import { GqlQueryResult } from './types';

export type InfrastructureLinkAlongRoute = {
  infrastructureLinkId: string;
  isTraversalForwards: boolean;
  shape: Geometry;
};

export const mapInfraLinksAlongRouteToGraphQL = (
  infraLinks: InfrastructureLinkAlongRoute[],
) =>
  infraLinks.map((link, index) => ({
    infrastructure_link_id: link.infrastructureLinkId,
    infrastructure_link_sequence: index,
    is_traversal_forwards: link.isTraversalForwards,
  }));

// Order the given infra links to match the order of the given external ids. Throws if there is no infra link
// present for a given external link id.
// NB: We cannot use sort on the infra link array, because some links might be traversed multiple times and thus
// have to be duplicated.
export const orderInfraLinksByExternalLinkId = (
  infraLinksWithStops: InfrastructureNetworkInfrastructureLink[],
  externalLinkIds: string[],
) =>
  externalLinkIds.map((externalLinkId) => {
    const infraLinkWithStop = infraLinksWithStops.find(
      (link) => link.external_link_id === externalLinkId,
    );

    if (!infraLinkWithStop) {
      throw new Error(
        `Could not find link with stop for external link id ${externalLinkId}`,
      );
    }

    return infraLinkWithStop;
  });

const INFRASTRUCTURE_LINK_ALL_FIELDS = gql`
  fragment infrastructure_link_all_fields on infrastructure_network_infrastructure_link {
    infrastructure_link_id
    direction
    shape
    estimated_length_in_metres
    external_link_id
    external_link_source
  }
`;

const QUERY_CLOSEST_LINK = gql`
  query QueryClosestLink($point: geography) {
    infrastructure_network_resolve_point_to_closest_link(
      args: { geog: $point }
    ) {
      ...infrastructure_link_all_fields
    }
  }
`;

export const mapClosestLinkResult = (
  result: GqlQueryResult<QueryClosestLinkQuery>,
) =>
  result.data?.infrastructure_network_resolve_point_to_closest_link[0] as
    | InfrastructureNetworkInfrastructureLink
    | undefined;

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

export const mapGetPointDirectionOnLinkResult = (
  result: GqlQueryResult<QueryPointDirectionOnLinkQuery>,
) =>
  result.data?.infrastructure_network_find_point_direction_on_link?.[0]
    ?.value as InfrastructureNetworkDirectionEnum | undefined;

const QUERY_MAP_EXTERNAL_LINK_IDS_TO_INFRA_LINKS_WITH_STOPS = gql`
  query MapExternalLinkIdsToInfraLinksWithStops($externalLinkIds: [String!]) {
    infrastructure_network_infrastructure_link(
      where: { external_link_id: { _in: $externalLinkIds } }
    ) {
      infrastructure_link_id
      external_link_id
      scheduled_stop_point_located_on_infrastructure_link {
        ...scheduled_stop_point_all_fields
        scheduled_stop_point_in_journey_patterns {
          ...scheduled_stop_point_in_journey_pattern_all_fields
        }
      }
      shape
    }
  }
`;

export const mapInfraLinkWithStopsResult = (
  result: GqlQueryResult<MapExternalLinkIdsToInfraLinksWithStopsQuery>,
) =>
  result.data?.infrastructure_network_infrastructure_link as
    | InfrastructureNetworkInfrastructureLink[]
    | [];

const GET_STOPS_ALONG_INFRASTRUCTURE_LINKS = gql`
  query GetStopsAlongInfrastructureLinks($infrastructure_link_ids: [uuid!]) {
    service_pattern_scheduled_stop_point(
      where: {
        located_on_infrastructure_link_id: { _in: $infrastructure_link_ids }
      }
    ) {
      ...scheduled_stop_point_all_fields
    }
  }
`;

export const mapGraphQLRouteToInfraLinks = (route: RouteRoute) => {
  return route.infrastructure_links_along_route.map((link) => ({
    infrastructureLinkId: link.infrastructure_link_id,
    isTraversalForwards: link.is_traversal_forwards,
    shape: link.infrastructure_link.shape,
  }));
};
