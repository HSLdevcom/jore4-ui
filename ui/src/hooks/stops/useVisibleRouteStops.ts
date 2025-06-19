import { useMemo } from 'react';
import { selectEditedRouteData, selectHasChangesInProgress } from '../../redux';
import { useAppSelector } from '../redux';
import { useGetRoutesDisplayedInMap } from '../routes';

/**
 * Hook for getting stop labels that belong to any displayed route or edited / created route
 */
export const useVisibleRouteStops = () => {
  const { displayedRoutes } = useGetRoutesDisplayedInMap();

  const { includedStopLabels: editedRouteStopLabels } = useAppSelector(
    selectEditedRouteData,
  );
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  const displayedRouteStopLabels = useMemo(
    () =>
      displayedRoutes
        .flatMap((route) => route.route_journey_patterns)
        .flatMap(
          (journeyPattern) =>
            journeyPattern.scheduled_stop_point_in_journey_patterns,
        )
        .map((stop) => stop.scheduled_stop_point_label),
    [displayedRoutes],
  );

  /**
   * Attach edited route's stops to the list of stops that should be displayed
   */
  const visibleRouteStopLabels = useMemo(
    () =>
      routeEditingInProgress
        ? [...displayedRouteStopLabels, ...editedRouteStopLabels]
        : displayedRouteStopLabels,
    [displayedRouteStopLabels, editedRouteStopLabels, routeEditingInProgress],
  );

  return { visibleRouteStopLabels };
};
