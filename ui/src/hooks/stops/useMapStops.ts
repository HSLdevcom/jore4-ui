import { DateTime } from 'luxon';
import { useCallback } from 'react';
import {
  ReusableComponentsVehicleModeEnum,
  RouteRoute,
  ServicePatternScheduledStopPoint,
  useGetRoutesWithInfrastructureLinksQuery,
} from '../../generated/graphql';
import { getRouteStopLabels, mapRouteResultToRoutes } from '../../graphql';
import {
  selectHasChangesInProgress,
  selectMapEditor,
  selectSelectedStopId,
} from '../../redux';
import { RequiredKeys } from '../../types';
import { Priority } from '../../types/Priority';
import { mapToVariables } from '../../utils';
import { useAppSelector } from '../redux';
import { mapRouteStopsToStopLabels, useGetDisplayedRoutes } from '../routes';
import { useObservationDateQueryParam } from '../urlQuery';
import { filterHighestPriorityCurrentStops } from './useFilterStops';

export type StopWithVehicleMode = RequiredKeys<
  Partial<ServicePatternScheduledStopPoint>,
  'vehicle_mode_on_scheduled_stop_point'
>;

const extractHighestPriorityStopsFromRoute = (
  route: RouteRoute,
  observationDate: DateTime,
) => {
  const routeStopPoints =
    route.route_journey_patterns[0].scheduled_stop_point_in_journey_patterns.flatMap(
      (journeyPatternStop) => journeyPatternStop.scheduled_stop_points,
    ) ?? [];

  return filterHighestPriorityCurrentStops(
    routeStopPoints,
    observationDate,
    // If the route is a draft, we want to select draft versions of stops if there are any
    route.priority === Priority.Draft,
  );
};

export const useMapStops = () => {
  const { editedRouteData, selectedRouteId } = useAppSelector(selectMapEditor);
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);
  const { observationDate } = useObservationDateQueryParam();
  const { displayedRouteIds } = useGetDisplayedRoutes();
  const selectedStopId = useAppSelector(selectSelectedStopId);

  const displayedRoutesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: displayedRouteIds }),
  );

  const displayedRoutes = mapRouteResultToRoutes(displayedRoutesResult);
  const selectedRoute = displayedRoutes.find(
    (route) => route.route_id === selectedRouteId,
  );

  const selectedRouteActiveStops = selectedRoute
    ? extractHighestPriorityStopsFromRoute(selectedRoute, observationDate)
    : [];

  const selectedRouteActiveStopIds = selectedRouteActiveStops.map(
    (stop) => stop.scheduled_stop_point_id,
  );

  const editedRouteStopIds = editedRouteData.stops
    .filter((stop) => stop.belongsToJourneyPattern)
    .flatMap((stop) => stop.scheduledStopPointId);

  const editedRouteStopLabels = mapRouteStopsToStopLabels(
    editedRouteData.stops,
  );

  const getStopVehicleMode = useCallback(
    (
      stop: StopWithVehicleMode,
    ): ReusableComponentsVehicleModeEnum | undefined => {
      const stopsLabelsOnRoutes = [
        ...editedRouteStopLabels,
        ...(displayedRoutes?.flatMap((route) => getRouteStopLabels(route)) ||
          []),
      ];

      return stop.label && stopsLabelsOnRoutes?.includes(stop.label)
        ? stop.vehicle_mode_on_scheduled_stop_point[0].vehicle_mode
        : undefined;
    },
    [displayedRoutes, editedRouteStopLabels],
  );

  const getStopHighlighted = useCallback(
    (id: UUID): boolean => {
      // If editing a route, highlight stops on edited route
      // Otherwise highlight stops belonging to selected route
      // Also hilight selectedRoute stops until editedRouteData is loaded
      const highlightedStopIds =
        routeEditingInProgress && editedRouteData.stops.length > 0
          ? editedRouteStopIds
          : selectedRouteActiveStopIds;

      return highlightedStopIds?.includes(id) || selectedStopId === id;
    },
    [
      routeEditingInProgress,
      editedRouteData.stops.length,
      editedRouteStopIds,
      selectedRouteActiveStopIds,
      selectedStopId,
    ],
  );

  return { getStopVehicleMode, getStopHighlighted };
};
