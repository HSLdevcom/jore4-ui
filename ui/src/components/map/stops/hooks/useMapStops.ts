import { DateTime } from 'luxon';
import { useCallback, useMemo } from 'react';
import {
  ReusableComponentsVehicleModeEnum,
  RouteWithJourneyPatternStopsFragment,
  useGetRouteDetailsByIdsQuery,
} from '../../../../generated/graphql';
import { getRouteStopLabels } from '../../../../graphql';
import { useAppSelector } from '../../../../hooks/redux';
import {
  selectEditedRouteIncludedStops,
  selectMapRouteEditor,
  selectSelectedStopAreaId,
  selectSelectedStopId,
} from '../../../../redux';
import { Priority } from '../../../../types/enums';
import {
  filterHighestPriorityCurrentStops,
  isCurrentEntity,
  mapToVariables,
} from '../../../../utils';
import { MapStop } from '../../types';
import { useMapObservationDate } from '../../utils/mapUrlState';

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
    routeStopPoints,
    observationDate,
    // If the route is a draft, we want to select draft versions of stops if there are any
    route.priority === Priority.Draft,
  );
};

export const useMapStops = (displayedRouteIds: ReadonlyArray<string>) => {
  const { selectedRouteId } = useAppSelector(selectMapRouteEditor);
  const selectedStopAreaId = useAppSelector(selectSelectedStopAreaId);
  const observationDate = useMapObservationDate();
  const selectedStopId = useAppSelector(selectSelectedStopId);
  const editedRouteIncludedStops = useAppSelector(
    selectEditedRouteIncludedStops,
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
    (stop) => stop.stop_place_ref,
  );

  const editedRouteStopIds = editedRouteIncludedStops.map(
    (stop) => stop.stop_place_ref,
  );

  const stopLabelToVehicleMode = useMemo(() => {
    const labelsToModes = new Map<string, ReusableComponentsVehicleModeEnum>();

    displayedRoutes.forEach((route) => {
      const vehicleMode = route.route_line.primary_vehicle_mode;
      getRouteStopLabels(route).forEach((label) => {
        if (!labelsToModes.has(label)) {
          labelsToModes.set(label, vehicleMode);
        }
      });
    });

    return labelsToModes;
  }, [displayedRoutes]);

  const usedStopLabels = useMemo(
    () =>
      new Set<string>([
        ...editedRouteIncludedStops
          .map((stop) => stop.label)
          .filter((label): label is string => !!label),
        ...stopLabelToVehicleMode.keys(),
      ]),
    [editedRouteIncludedStops, stopLabelToVehicleMode],
  );

  const getStopVehicleMode = useCallback(
    (stop: MapStop): ReusableComponentsVehicleModeEnum | undefined =>
      stop.vehicle_mode ?? stopLabelToVehicleMode.get(stop.label),
    [stopLabelToVehicleMode],
  );

  const getStopShouldBeGray = useCallback(
    (stop: MapStop): boolean =>
      !usedStopLabels.has(stop.label) && isCurrentEntity(observationDate, stop),
    [observationDate, usedStopLabels],
  );

  // If editing a route, highlight stops on edited route
  // Otherwise highlight stops belonging to selected route
  // Also highlight selectedRoute stops until editedRouteData is loaded
  const highlightedStopIds =
    editedRouteIncludedStops.length > 0
      ? editedRouteStopIds
      : selectedRouteActiveStopIds;
  const getStopHighlighted = useCallback(
    (stop: MapStop): boolean =>
      selectedStopAreaId === stop.stop_place_netex_id ||
      selectedStopId === stop.netex_id ||
      highlightedStopIds.includes(stop.netex_id),
    [highlightedStopIds, selectedStopId, selectedStopAreaId],
  );

  return { getStopVehicleMode, getStopHighlighted, getStopShouldBeGray };
};
