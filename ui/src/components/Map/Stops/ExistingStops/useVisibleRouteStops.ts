import { useMemo } from 'react';
import {
  selectEditedRouteData,
  selectHasChangesInProgress,
  selectMapRouteEditor,
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
  const { suppressBaseRouteRehydrate } = useAppSelector(selectMapRouteEditor);
  const routeEditingInProgress = useAppSelector(selectHasChangesInProgress);

  // When route geometry was explicitly deleted during existing-route edit,
  // hide that route's own stops from "visible route stops" so map stop filtering
  // does not keep showing stale stop labels for the hidden route line.
  const hiddenEditedRouteStopLabels = useMemo(
    () =>
      suppressBaseRouteRehydrate && editedRouteId
        ? displayedRoutes
            .filter((route) => route.route_id === editedRouteId)
            .flatMap((route) => route.route_journey_patterns)
            .flatMap(
              (journeyPattern) =>
                journeyPattern.scheduled_stop_point_in_journey_patterns,
            )
            .map((stop) => stop.scheduled_stop_point_label)
        : [],
    [displayedRoutes, editedRouteId, suppressBaseRouteRehydrate],
  );

  const displayedRouteStopLabels = useMemo(
    () =>
      displayedRoutes
        .flatMap((route) => route.route_journey_patterns)
        .flatMap(
          (journeyPattern) =>
            journeyPattern.scheduled_stop_point_in_journey_patterns,
        )
        .map((stop) => stop.scheduled_stop_point_label)
        .filter(
          // Keep all other route stop labels visible; remove only the hidden edited route's labels.
          (label) => !hiddenEditedRouteStopLabels.includes(label),
        ),
    [displayedRoutes, hiddenEditedRouteStopLabels],
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
