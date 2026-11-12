import { useMemo } from 'react';
import {
  selectEditedRouteData,
  selectHasChangesInProgress,
  selectIsRedrawingExistingRoute,
  selectVisibleOrSelectedRouteIds,
  useAppSelector,
} from '../../../../redux';
import { useGetRoutesDisplayedInMap } from '../utils';

/**
 * Hook for getting stop labels that belong to any route shown on the map or
 * edited / created route
 */
export function useVisibleRouteStops() {
  const { displayedRoutes } = useGetRoutesDisplayedInMap();
  const visibleRouteIds = useAppSelector(selectVisibleOrSelectedRouteIds);

  const { id: editedRouteId, includedStopLabels: editedRouteStopLabels } =
    useAppSelector(selectEditedRouteData);
  const isRedrawingExistingRoute = useAppSelector(
    selectIsRedrawingExistingRoute,
  );
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  const displayedRouteStopLabels = useMemo(
    () =>
      displayedRoutes
        .filter((route) => visibleRouteIds.includes(route.route_id))
        // Exclude the hidden route before flattening to preserve shared stops on other routes.
        .filter(
          (route) =>
            !isRedrawingExistingRoute || route.route_id !== editedRouteId,
        )
        .flatMap((route) => route.route_journey_patterns)
        .flatMap(
          (journeyPattern) =>
            journeyPattern.scheduled_stop_point_in_journey_patterns,
        )
        .map((stop) => stop.scheduled_stop_point_label),
    [displayedRoutes, visibleRouteIds, editedRouteId, isRedrawingExistingRoute],
  );

  const visibleRouteStopLabels: ReadonlyArray<string> = useMemo(
    () =>
      routeEditingInProgress
        ? [...displayedRouteStopLabels, ...editedRouteStopLabels]
        : displayedRouteStopLabels,
    [displayedRouteStopLabels, editedRouteStopLabels, routeEditingInProgress],
  );

  return { visibleRouteStopLabels };
}
