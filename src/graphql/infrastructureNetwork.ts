import { ServicePatternScheduledStopPoint } from '../generated/graphql';

export type InfrastructureLink = {
  infrastructureLinkId: string;
  isTraversalForwards: boolean;
};

export const findStopIndexByInfraLink = (
  infraLinks: InfrastructureLink[],
  stop: ServicePatternScheduledStopPoint,
) =>
  infraLinks.findIndex(
    (infraLink) =>
      infraLink.infrastructureLinkId === stop.located_on_infrastructure_link_id,
  );

export const mapInfraLinksToGraphQL = (infraLinks: InfrastructureLink[]) =>
  infraLinks.map((link, index) => ({
    infrastructure_link_id: link.infrastructureLinkId,
    infrastructure_link_sequence: index,
    is_traversal_forwards: link.isTraversalForwards,
  }));
