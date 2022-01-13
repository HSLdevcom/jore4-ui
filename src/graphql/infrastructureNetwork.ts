export type InfrastructureLinkAlongRoute = {
  infrastructureLinkId: string;
  isTraversalForwards: boolean;
};

export const findEntryIndexByExtLinkId = (
  extLinkIds: string[],
  // eslint-disable-next-line camelcase
  infraLink: { external_link_id: string },
) =>
  extLinkIds.findIndex((extLinkId) => extLinkId === infraLink.external_link_id);

export const mapInfraLinksAlongRouteToGraphQL = (
  infraLinks: InfrastructureLinkAlongRoute[],
) =>
  infraLinks.map((link, index) => ({
    infrastructure_link_id: link.infrastructureLinkId,
    infrastructure_link_sequence: index,
    is_traversal_forwards: link.isTraversalForwards,
  }));
