import { gql } from '@apollo/client';
import { InfrastructureLinkAllFieldsFragment } from '../../../../../generated/graphql';
import { RouteInfraLink } from '../../../../../types';

const GQL_INFRASTRUCTURE_LINK_ALL_FIELDS = gql`
  fragment InfrastructureLinkAllFields on infrastructure_network_infrastructure_link {
    infrastructure_link_id
    direction
    shape
    estimated_length_in_metres
    external_link_id
    external_link_source
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
