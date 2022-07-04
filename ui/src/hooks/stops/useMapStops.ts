import { useCallback } from 'react';
import {
  ReusableComponentsVehicleModeEnum,
  ServicePatternScheduledStopPoint,
  useGetRoutesWithInfrastructureLinksQuery,
  useGetStopsByLabelsQuery,
} from '../../generated/graphql';
import {
  getRouteStopLabels,
  mapGetStopsResult,
  mapRouteResultToRoutes,
} from '../../graphql';
import {
  selectHasChangesInProgress,
  selectMapEditor,
  selectSelectedStopId,
} from '../../redux';
import { RequiredKeys } from '../../types';
import { mapToVariables } from '../../utils';
import { useAppSelector } from '../redux';
import { useGetDisplayedRoutes } from '../routes/useGetDisplayedRoutes';
import { useExtractRouteFromFeature } from '../useExtractRouteFromFeature';

export type StopWithVehicleMode = RequiredKeys<
  Partial<ServicePatternScheduledStopPoint>,
  'vehicle_mode_on_scheduled_stop_point'
>;

export const useMapStops = () => {
  const { editedRouteData, selectedRouteId } = useAppSelector(selectMapEditor);
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);
  const { displayedRouteIds } = useGetDisplayedRoutes();
  const selectedStopId = useAppSelector(selectSelectedStopId);
  const { mapRouteStopsToStopLabels } = useExtractRouteFromFeature();

  const selectedRoutesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: selectedRouteId ? [selectedRouteId] : [] }),
  );
  const selectedRoutes = mapRouteResultToRoutes(selectedRoutesResult);
  const selectedRouteStopsResult = useGetStopsByLabelsQuery(
    mapToVariables({
      stopLabels:
        selectedRoutes?.flatMap((route) => getRouteStopLabels(route)) || [],
    }),
  );
  const stopsIdsOnSelectedRoute = mapGetStopsResult(
    selectedRouteStopsResult,
  )?.map((stop) => stop.scheduled_stop_point_id);

  const displayedRoutesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: displayedRouteIds }),
  );
  const displayedRoutes = mapRouteResultToRoutes(displayedRoutesResult);

  const stopLabelsOnEditedRoute = mapRouteStopsToStopLabels(
    editedRouteData.stops,
  );

  const editedRouteStopsResult = useGetStopsByLabelsQuery(
    mapToVariables({
      stopLabels: stopLabelsOnEditedRoute,
    }),
  );

  const stopsIdsOnEditedRoute = mapGetStopsResult(editedRouteStopsResult)?.map(
    (stop) => stop.scheduled_stop_point_id,
  );

  const getStopVehicleMode = useCallback(
    (
      stop: StopWithVehicleMode,
    ): ReusableComponentsVehicleModeEnum | undefined => {
      const stopsLabelsOnRoutes = [
        ...stopLabelsOnEditedRoute,
        ...(displayedRoutes?.flatMap((route) => getRouteStopLabels(route)) ||
          []),
      ];

      return stop.label && stopsLabelsOnRoutes?.includes(stop.label)
        ? stop.vehicle_mode_on_scheduled_stop_point[0].vehicle_mode
        : undefined;
    },
    [displayedRoutes, stopLabelsOnEditedRoute],
  );

  const getStopHighlighted = useCallback(
    (id: UUID): boolean => {
      // If editing a route, highlight stops on edited route
      // Otherwise highlight stops belonging to selected route
      const highlightedStopIds = routeEditingInProgress
        ? stopsIdsOnEditedRoute
        : stopsIdsOnSelectedRoute;

      return highlightedStopIds?.includes(id) || selectedStopId === id;
    },
    [
      routeEditingInProgress,
      stopsIdsOnEditedRoute,
      stopsIdsOnSelectedRoute,
      selectedStopId,
    ],
  );

  return { getStopVehicleMode, getStopHighlighted };
};
