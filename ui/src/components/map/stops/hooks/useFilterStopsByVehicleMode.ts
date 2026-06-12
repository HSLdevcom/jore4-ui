import { useCallback } from 'react';
import { StopRegistryTransportModeType } from '../../../../generated/graphql';
import { useAppSelector } from '../../../../hooks';
import { FilterType, selectMapFilter } from '../../../../redux';
import { MapStop } from '../../types';
import { useVisibleRouteStops } from './useVisibleRouteStops';

export function useFilterStopsByVehicleMode(showRoute: boolean) {
  const { stopFilters } = useAppSelector(selectMapFilter);
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
          stopFilters[FilterType.ShowAllBusStops]
        ) {
          return true;
        }

        if (
          stop.transport_modes.includes(StopRegistryTransportModeType.Tram) &&
          stopFilters[FilterType.ShowAllTramStops]
        ) {
          return true;
        }

        return false;
      }),
    [showRoute, stopFilters, visibleRouteStopLabels],
  );
}
