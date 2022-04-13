import { useCallback } from 'react';
import {
  ReusableComponentsVehicleModeEnum,
  ServicePatternScheduledStopPoint,
  useGetRoutesWithInfrastructureLinksQuery,
} from '../../generated/graphql';
import { getRouteStopIds, mapRoutesDetailsResult } from '../../graphql';
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
  const { mapRouteStopsToStopIds } = useExtractRouteFromFeature();

  const highlightedStopsRouteIds = selectedRouteId ? [selectedRouteId] : [];

  const highlightedStopsRoutesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: highlightedStopsRouteIds }),
  );
  const highlightedStopsRoutes = mapRoutesDetailsResult(
    highlightedStopsRoutesResult,
  );

  const displayedRoutesResult = useGetRoutesWithInfrastructureLinksQuery(
    mapToVariables({ route_ids: displayedRouteIds }),
  );
  const displayedRoutes = mapRoutesDetailsResult(displayedRoutesResult);

  const stopIdsOnEditedRoute = mapRouteStopsToStopIds(editedRouteData.stops);

  const getStopVehicleMode = useCallback(
    (
      stopId: UUID,
      stop: StopWithVehicleMode,
    ): ReusableComponentsVehicleModeEnum | undefined => {
      const stopsIdsOnRoutes = [
        ...stopIdsOnEditedRoute,
        ...(displayedRoutes?.flatMap((route) => getRouteStopIds(route)) || []),
      ];

      return stopsIdsOnRoutes?.includes(stopId)
        ? stop.vehicle_mode_on_scheduled_stop_point[0].vehicle_mode
        : undefined;
    },
    [displayedRoutes, stopIdsOnEditedRoute],
  );

  const getStopHighlighted = useCallback(
    (stopId: UUID): boolean => {
      // If editing a route, highlight stops on edited route
      // Otherwise highlight stops belonging to highlighted routes
      const highlightedStopIds = routeEditingInProgress
        ? stopIdsOnEditedRoute
        : highlightedStopsRoutes?.flatMap((route) => getRouteStopIds(route)) ||
          [];

      return highlightedStopIds?.includes(stopId) || selectedStopId === stopId;
    },
    [
      routeEditingInProgress,
      stopIdsOnEditedRoute,
      highlightedStopsRoutes,
      selectedStopId,
    ],
  );

  return { getStopVehicleMode, getStopHighlighted };
};
