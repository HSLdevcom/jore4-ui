import { DateTime } from 'luxon';
import { useCallback, useMemo } from 'react';
import { StopDetails } from '../../components/map/useMapData';
import {
  ReusableComponentsVehicleModeEnum,
  RouteWithJourneyPatternStopsFragment,
  ScheduledStopPointAllFieldsFragment,
  ServicePatternScheduledStopPoint,
  useGetRouteDetailsByIdsQuery,
} from '../../generated/graphql';
import { getRouteStopLabels } from '../../graphql';
import {
  selectEditedRouteData,
  selectEditedRouteIncludedStops,
  selectMapRouteEditor,
  selectSelectedStopId,
} from '../../redux';
import { RequiredKeys } from '../../types';
import { Priority } from '../../types/enums';
import { filterHighestPriorityCurrentStops, mapToVariables } from '../../utils';
import { useAppSelector } from '../redux';
import { useGetRoutesDisplayedInMap } from '../routes';
import { useObservationDateQueryParam } from '../urlQuery';
import { FilterableStop } from './useFilterStops';

export type StopWithVehicleMode = RequiredKeys<
  Partial<ServicePatternScheduledStopPoint>,
  'vehicle_mode_on_scheduled_stop_point'
>;

const extractHighestPriorityStopsFromRoute = <
  TRoute extends RouteWithJourneyPatternStopsFragment,
>(
  route: TRoute,
  observationDate: DateTime,
) => {
  const routeStopPoints =
    route.route_journey_patterns[0].ordered_scheduled_stop_point_in_journey_patterns.flatMap(
      (journeyPatternStop) => journeyPatternStop.scheduled_stop_points,
    ) ?? [];

  return filterHighestPriorityCurrentStops(
    routeStopPoints.map(
      (stop) =>
        new FilterableStop<ScheduledStopPointAllFieldsFragment>(
          stop as ScheduledStopPointAllFieldsFragment,
        ),
    ),
    observationDate,
    // If the route is a draft, we want to select draft versions of stops if there are any
    route.priority === Priority.Draft,
  );
};

export const useMapStops = () => {
  const { selectedRouteId } = useAppSelector(selectMapRouteEditor);
  const { observationDate } = useObservationDateQueryParam();
  const { displayedRouteIds } = useGetRoutesDisplayedInMap();
  const selectedStopId = useAppSelector(selectSelectedStopId);
  const editedRouteIncludedStops = useAppSelector(
    selectEditedRouteIncludedStops,
  );

  const { includedStopLabels: editedRouteStopLabels } = useAppSelector(
    selectEditedRouteData,
  );

  const displayedRoutesResult = useGetRouteDetailsByIdsQuery(
    mapToVariables({ route_ids: displayedRouteIds }),
  );

  const displayedRoutes = useMemo(
    () => displayedRoutesResult.data?.route_route ?? [],
    [displayedRoutesResult],
  );

  const selectedRoute = displayedRoutes.find(
    (route) => route.route_id === selectedRouteId,
  );

  const selectedRouteActiveStops = selectedRoute
    ? extractHighestPriorityStopsFromRoute(selectedRoute, observationDate)
    : [];

  const selectedRouteActiveStopIds = selectedRouteActiveStops.map(
    (stop) => stop.scheduled_stop_point_id,
  );

  const editedRouteStopIds = editedRouteIncludedStops.map(
    (stop) => stop.scheduled_stop_point_id,
  );

  const getStopVehicleMode = useCallback(
    (
      stop: FilterableStop<StopDetails>,
    ): ReusableComponentsVehicleModeEnum | undefined => {
      const stopsLabelsOnRoutes = [
        ...editedRouteStopLabels,
        ...(displayedRoutes?.flatMap((route) => getRouteStopLabels(route)) ??
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
      // Also highlight selectedRoute stops until editedRouteData is loaded
      const highlightedStopIds =
        editedRouteIncludedStops.length > 0
          ? editedRouteStopIds
          : selectedRouteActiveStopIds;

      return highlightedStopIds?.includes(id) || selectedStopId === id;
    },
    [
      editedRouteIncludedStops.length,
      editedRouteStopIds,
      selectedRouteActiveStopIds,
      selectedStopId,
    ],
  );

  return { getStopVehicleMode, getStopHighlighted };
};
