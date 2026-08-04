import { gql } from '@apollo/client';
import {
  InfrastructureLinkAllFieldsFragment,
  RouteWithInfrastructureLinksFragment,
} from '../../../../generated/graphql';
import { RouteInfraLink } from '../../../../types';

const GQL_INFRASTRUCTURE_LINK_ALL_FIELDS = gql`
  fragment infrastructure_link_all_fields on infrastructure_network_infrastructure_link {
    infrastructure_link_id
    direction
    shape
    estimated_length_in_metres
    external_link_id
    external_link_source
  }
`;

const GQL_INFRA_LINK_MATCHING_FIELDS = gql`
  fragment infra_link_matching_fields on infrastructure_network_infrastructure_link {
    external_link_id
    infrastructure_link_id
    shape
    direction
  }
`;

export function mapInfraLinksAlongRouteToGraphQL(
  infraLinks: ReadonlyArray<
    RouteInfraLink<InfrastructureLinkAllFieldsFragment>
  >,
) {
  return infraLinks.map((link, index) => ({
    infrastructure_link_id: link.infrastructure_link_id,
    infrastructure_link_sequence: index,
    is_traversal_forwards: link.is_traversal_forwards,
  }));
}

export function mapRouteToInfraLinksAlongRoute(
  route: RouteWithInfrastructureLinksFragment,
) {
  return route.infrastructure_links_along_route.map((item) => ({
    ...item.infrastructure_link,
    is_traversal_forwards: item.is_traversal_forwards,
  }));
}
