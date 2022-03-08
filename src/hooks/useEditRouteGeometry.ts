import { FormState as RouteFormState } from '../components/forms/RoutePropertiesForm';
import {
  InsertRouteOneMutationVariables,
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
  };
};
