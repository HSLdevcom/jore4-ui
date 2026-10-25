import { useMemo } from 'react';
import {
  selectEditedRouteData,
  selectHasChangesInProgress,
  selectIsRedrawingExistingRoute,
  useAppSelector,
} from '../../../../redux';
import { useGetRoutesDisplayedInMap } from '../utils';

/**
 * Hook for getting stop labels that belong to any displayed route or edited / created route
 */
export function useVisibleRouteStops() {
  const { displayedRoutes } = useGetRoutesDisplayedInMap();

  const { id: editedRouteId, includedStopLabels: editedRouteStopLabels } =
    useAppSelector(selectEditedRouteData);
  const isRedrawingExistingRoute = useAppSelector(
    selectIsRedrawingExistingRoute,
  );
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  const displayedRouteStopLabels = useMemo(
    () =>
      displayedRoutes
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
    [displayedRoutes, editedRouteId, isRedrawingExistingRoute],
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
