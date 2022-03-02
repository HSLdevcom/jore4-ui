import { FormState as RouteFormState } from '../components/forms/RoutePropertiesForm';
import {
  InfrastructureNetworkDirectionEnum,
  InsertRouteOneMutationVariables,
  MapExternalLinkIdsToInfraLinksWithStopsQuery,
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  UpdateRouteGeometryMutationVariables,
  useDeleteRouteMutation,
  useDeleteStopFromJourneyPatternMutation,
  useInsertRouteOneMutation,
  useUpdateRouteGeometryMutation,
} from '../generated/graphql';
import {
  InfrastructureLinkAlongRoute,
  mapInfraLinksAlongRouteToGraphQL,
} from '../graphql';
import {
  mapDateInputToValidityEnd,
  mapDateInputToValidityStart,
  mapToObject,
  mapToVariables,
  removeFromApolloCache,
} from '../utils';

interface DeleteStopFromJourneyPatternParams {
  routeId: UUID;
  stopPointId: UUID;
}

interface ExtractScheduledStopPointIdsParams {
  orderedInfraLinksWithStops: MapExternalLinkIdsToInfraLinksWithStopsQuery['infrastructure_network_infrastructure_link'];
  infraLinks: InfrastructureLinkAlongRoute[];
  vehicleMode: ReusableComponentsVehicleModeEnum;
  oldLinks: InfrastructureLinkAlongRoute[];
  oldStopIds: UUID[];
}

export const useEditRouteGeometry = () => {
  const [insertRouteMutation] = useInsertRouteOneMutation();
  const [updateRouteGeometryMutation] = useUpdateRouteGeometryMutation();
  const [deleteRouteMutation] = useDeleteRouteMutation();
  const [deleteStopFromJourneyPatternMutation] =
    useDeleteStopFromJourneyPatternMutation();

  const mapRouteDetailsToInsertMutationVariables = (
    routeDetails: Partial<RouteFormState>,
    stopIdsWithinRoute: UUID[],
    infraLinksAlongRoute: InfrastructureLinkAlongRoute[],
    startingStopId: UUID,
    finalStopId: UUID,
  ) => {
    const variables: InsertRouteOneMutationVariables = mapToObject({
      starts_from_scheduled_stop_point_id: startingStopId,
      ends_at_scheduled_stop_point_id: finalStopId,
      on_line_id: routeDetails.on_line_id,
      label: routeDetails.label,
      description_i18n: routeDetails.description_i18n,
      direction: RouteDirectionEnum.Outbound, // TODO: make this user-configurable
      priority: routeDetails.priority,
      validity_start: mapDateInputToValidityStart(
        // form validation makes sure that 'validityStart' has a valid value at this poin
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        routeDetails.validityStart!,
      ),
      validity_end: mapDateInputToValidityEnd(
        routeDetails.validityEnd,
        routeDetails.indefinite,
      ),
      // route_shape cannot be added here, it is gathered dynamically by the route view from the route's infrastructure_links_along_route
      infrastructure_links_along_route: {
        data: mapInfraLinksAlongRouteToGraphQL(infraLinksAlongRoute),
      },
      route_journey_patterns: {
        data: {
          scheduled_stop_point_in_journey_patterns: {
            data: stopIdsWithinRoute.map((stopId, index) => ({
              scheduled_stop_point_id: stopId,
              scheduled_stop_point_sequence: index,
            })),
          },
        },
      },
    });

    return mapToVariables(variables);
  };

  const mapRouteDetailsToUpdateMutationVariables = (
    editingRouteId: UUID,
    stopIdsWithinRoute: UUID[],
    infraLinksAlongRoute: InfrastructureLinkAlongRoute[],
    startingStopId: UUID,
    finalStopId: UUID,
  ) => {
    const variables: UpdateRouteGeometryMutationVariables = {
      route_id: editingRouteId,
      new_infrastructure_links: mapInfraLinksAlongRouteToGraphQL(
        infraLinksAlongRoute,
      ).map((link) => ({ ...link, route_id: editingRouteId })),
      new_journey_pattern: {
        on_route_id: editingRouteId,
        scheduled_stop_point_in_journey_patterns: {
          data: stopIdsWithinRoute.map((stopId, index) => ({
            scheduled_stop_point_id: stopId,
            scheduled_stop_point_sequence: index,
          })),
        },
      },
      route_route: {
        starts_from_scheduled_stop_point_id: startingStopId,
        ends_at_scheduled_stop_point_id: finalStopId,
      },
    };

    return mapToVariables(variables);
  };

  const deleteRoute = async (routeId: UUID) => {
    await deleteRouteMutation(mapToVariables({ route_id: routeId }));
  };

  const deleteStopFromJourneyPattern = async ({
    routeId,
    stopPointId,
  }: DeleteStopFromJourneyPatternParams) => {
    await deleteStopFromJourneyPatternMutation({
      ...mapToVariables({
        route_id: routeId,
        scheduled_stop_point_id: stopPointId,
      }),
      // remove scheduled stop point from cache after mutation
      update(cache) {
        removeFromApolloCache(cache, {
          scheduled_stop_point_id: stopPointId,
          __typename: 'service_pattern_scheduled_stop_point',
        });
      },
    });
  };

  // Sort and filter the stop point ids from a MapExternalLinkIdsToInfraLinksWithStops
  // query result.
  const extractScheduledStopPoints = ({
    orderedInfraLinksWithStops,
    infraLinks,
    vehicleMode,
    oldLinks,
    oldStopIds,
  }: ExtractScheduledStopPointIdsParams) =>
    orderedInfraLinksWithStops.flatMap((infraLinkWithStops, index) => {
      const isLinkTraversalForwards = infraLinks[index].isTraversalForwards;

      return (
        infraLinkWithStops.scheduled_stop_point_located_on_infrastructure_link
          // only include the ids of the stops
          // - suitable for the given vehicle mode AND
          // - traversable in the direction in which the route is going
          .filter((stop) => {
            const suitableForVehicleMode =
              !!stop.vehicle_mode_on_scheduled_stop_point.find(
                (item) => item.vehicle_mode === vehicleMode,
              );

            const matchingDirection =
              stop.direction ===
                InfrastructureNetworkDirectionEnum.Bidirectional ||
              (isLinkTraversalForwards &&
                stop.direction ===
                  InfrastructureNetworkDirectionEnum.Forward) ||
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
          .map((stop) => {
            const removedFromRoute =
              // This link was part of the route before
              oldLinks.find(
                (link) =>
                  link.infrastructureLinkId ===
                  infraLinkWithStops.infrastructure_link_id,
                // This stop was not included in the route previously
              ) && !oldStopIds.includes(stop.scheduled_stop_point_id);

            return {
              id: stop.scheduled_stop_point_id,
              belongsToRoute: !removedFromRoute,
            };
          })
      );
    });

  return {
    // edit
    updateRouteGeometryMutation,
    mapRouteDetailsToUpdateMutationVariables,
    deleteStopFromJourneyPattern,
    // create
    insertRouteMutation,
    mapRouteDetailsToInsertMutationVariables,
    // delete
    deleteRoute,
    // helpers
    extractScheduledStopPoints,
  };
};
