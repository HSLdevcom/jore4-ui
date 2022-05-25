import { useCallback } from 'react';
import {
  ReusableComponentsVehicleModeEnum,
  ServicePatternScheduledStopPoint,
  useGetRoutesWithInfrastructureLinksQuery,
} from '../../generated/graphql';
import { getRouteStopLabels, mapRoutesDetailsResult } from '../../graphql';
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

  const stopLabelsOnEditedRoute = mapRouteStopsToStopLabels(
    editedRouteData.stops,
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
    (id: UUID, label: string): boolean => {
      // If editing a route, highlight stops on edited route
      // Otherwise highlight stops belonging to highlighted routes
      const highlightedStopLabels = routeEditingInProgress
        ? stopLabelsOnEditedRoute
        : highlightedStopsRoutes?.flatMap((route) =>
            getRouteStopLabels(route),
          ) || [];

      return highlightedStopLabels?.includes(label) || selectedStopId === id;
    },
    [
      routeEditingInProgress,
      stopLabelsOnEditedRoute,
      highlightedStopsRoutes,
      selectedStopId,
    ],
  );

  return { getStopVehicleMode, getStopHighlighted };
};
