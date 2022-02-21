import { FormState as RouteFormState } from '../components/forms/RoutePropertiesForm';
import {
  InsertRouteOneMutationVariables,
  RouteDirectionEnum,
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
} from '../utils';

export const useEditRouteGeometry = () => {
  const [insertRouteMutation] = useInsertRouteOneMutation();
  const [updateRouteGeometryMutation] = useUpdateRouteGeometryMutation();

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
    const variables = mapToVariables({
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
    });

    return variables;
  };

  return {
    // edit
    updateRouteGeometryMutation,
    mapRouteDetailsToUpdateMutationVariables,
    // create
    insertRouteMutation,
    mapRouteDetailsToInsertMutationVariables,
  };
};
