import {
  InfrastructureNetworkDirectionEnum,
  MapExternalLinkIdsToInfraLinksWithStopsQuery,
  ReusableComponentsVehicleModeEnum,
} from '../generated/graphql';

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

// Sort and filter the stop point ids from a MapExternalLinkIdsToInfraLinksWithStops
// query result.
export const extractScheduledStopPointIds = (
  sortedInfraLinksWithStops: MapExternalLinkIdsToInfraLinksWithStopsQuery['infrastructure_network_infrastructure_link'],
  infraLinks: InfrastructureLinkAlongRoute[],
  vehicleMode: ReusableComponentsVehicleModeEnum,
) =>
  sortedInfraLinksWithStops.flatMap((infraLinkWithStops, index) => {
    const isLinkTraversalForwards = infraLinks[index].isTraversalForwards;

    return (
      infraLinkWithStops.scheduled_stop_point_located_on_infrastructure_link
        // only include the ids of the stops
        // - suitable for the given vehicle mode AND
        // - traversable in the direction in which the route is going
        .filter((stop) => {
          const suitableForVehicleMode = !!stop.vehicle_mode_on_scheduled_stop_point.find(
            (item) => item.vehicle_mode === vehicleMode,
          );

          const matchingDirection =
            stop.direction ===
              InfrastructureNetworkDirectionEnum.Bidirectional ||
            (isLinkTraversalForwards &&
              stop.direction === InfrastructureNetworkDirectionEnum.Forward) ||
            (!isLinkTraversalForwards &&
              stop.direction === InfrastructureNetworkDirectionEnum.Backward);

          return suitableForVehicleMode && matchingDirection;
        })
        // sort the stops on the same link according to the link traversal direction
        .sort((stop1, stop2) =>
          isLinkTraversalForwards
            ? stop1.relative_distance_from_infrastructure_link_start -
              stop2.relative_distance_from_infrastructure_link_start
            : stop2.relative_distance_from_infrastructure_link_start -
              stop1.relative_distance_from_infrastructure_link_start,
        )
        .map((stop) => stop.scheduled_stop_point_id)
    );
  });
