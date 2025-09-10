import { DateTime } from 'luxon';
import { useCallback, useMemo } from 'react';
import {
  ReusableComponentsVehicleModeEnum,
  RouteWithJourneyPatternStopsFragment,
  useGetRouteDetailsByIdsQuery,
} from '../../../../generated/graphql';
import { getRouteStopLabels } from '../../../../graphql';
import { useAppSelector } from '../../../../hooks/redux';
import { useObservationDateQueryParam } from '../../../../hooks/urlQuery';
import {
  selectEditedRouteData,
  selectEditedRouteIncludedStops,
  selectMapRouteEditor,
  selectSelectedStopAreaId,
  selectSelectedStopId,
} from '../../../../redux';
import { Priority } from '../../../../types/enums';
import {
  filterHighestPriorityCurrentStops,
  mapToVariables,
} from '../../../../utils';
import { MapStop } from '../../types';

type LabelledStop = { readonly label: string };

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
  const { observationDate } = useObservationDateQueryParam();
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
    (stop) => stop.stop_place_ref,
  );

  const editedRouteStopIds = editedRouteIncludedStops.map(
    (stop) => stop.stop_place_ref,
  );

  const getStopVehicleMode = useCallback(
    (stop: LabelledStop): ReusableComponentsVehicleModeEnum | undefined => {
      const stopsLabelsOnRoutes = [
        ...editedRouteStopLabels,
        ...(displayedRoutes.flatMap(getRouteStopLabels) ?? []),
      ];

      // Note added during change: Fetch stops from StopDB instead of Lines DB
      // Currently the vehicleMode is always Bus as we do not have other
      // modes implemented yet. Also, this value should be based on type of
      // the line we are inspecting, not on the type of the stop itself.
      // A train cannot stop at a bus stop after all.

      return stop.label && stopsLabelsOnRoutes.includes(stop.label)
        ? // TODO: Determinate type based on the active route
          ReusableComponentsVehicleModeEnum.Bus
        : undefined;
    },
    [displayedRoutes, editedRouteStopLabels],
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

  return { getStopVehicleMode, getStopHighlighted };
};
