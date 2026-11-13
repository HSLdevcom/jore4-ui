import { useCallback } from 'react';
import { StopRegistryTransportModeType } from '../../../../generated/graphql';
import { FilterType, selectMapFilter, useAppSelector } from '../../../../redux';
import { MapStop } from '../../Types';
import { useVisibleRouteStops } from './useVisibleRouteStops';

export function useFilterStopsByVehicleMode(showRoute: boolean) {
  const { timeAndPriorityFilters } = useAppSelector(selectMapFilter);
  const { visibleRouteStopLabels } = useVisibleRouteStops();

  return useCallback(
    (stops: ReadonlyArray<MapStop>): ReadonlyArray<MapStop> =>
      stops.filter((stop) => {
        const isStopInVisibleRoutes =
          showRoute && visibleRouteStopLabels.includes(stop.label);

        if (isStopInVisibleRoutes) {
          return true;
        }

        if (
          stop.transport_modes.includes(StopRegistryTransportModeType.Bus) &&
          timeAndPriorityFilters[FilterType.ShowAllBusStops]
        ) {
          return true;
        }

        if (
          stop.transport_modes.includes(StopRegistryTransportModeType.Tram) &&
          timeAndPriorityFilters[FilterType.ShowAllTramStops]
        ) {
          return true;
        }

        return false;
      }),
    [showRoute, timeAndPriorityFilters, visibleRouteStopLabels],
  );
}
