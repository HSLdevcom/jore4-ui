import { useMemo } from 'react';
import { pipe } from 'remeda';
import { selectEditedRouteData, selectHasChangesInProgress } from '../../redux';
import { useAppSelector } from '../redux';
import { useGetDisplayedRoutes } from '../routes';

/**
 * Hook for getting stop labels that belong to any displayed route or edited / created route
 */
export const useVisibleRouteStops = () => {
  const { displayedRoutes } = useGetDisplayedRoutes();

  const { includedStopLabels: editedRouteStopLabels } = useAppSelector(
    selectEditedRouteData,
  );
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  const displayedRouteStopLabels = pipe(
    displayedRoutes,
    (routes) => routes.flatMap((route) => route.route_journey_patterns),
    (journeyPatterns) =>
      journeyPatterns.flatMap(
        (journeyPattern) =>
          journeyPattern.scheduled_stop_point_in_journey_patterns,
      ),
    (stops) => stops.map((stop) => stop.scheduled_stop_point_label),
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
