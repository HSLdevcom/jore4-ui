import { useCallback } from 'react';
import { ReusableComponentsVehicleModeEnum } from '../../../../generated/graphql';
import { useAppSelector } from '../../../../hooks';
import { FilterType, selectMapFilter } from '../../../../redux';
import { MapStop } from '../../types';
import { useVisibleRouteStops } from './useVisibleRouteStops';

export function useFilterStopsByVehicleMode(
  getStopVehicleMode: (
    stop: MapStop,
  ) => ReusableComponentsVehicleModeEnum | undefined,
) {
  const { stopFilters } = useAppSelector(selectMapFilter);
  const { visibleRouteStopLabels } = useVisibleRouteStops();

  return useCallback(
    (stops: ReadonlyArray<MapStop>): ReadonlyArray<MapStop> =>
      stops.filter((stop) => {
        const vehicleMode = getStopVehicleMode(stop);
        const isStopInVisibleRoutes = visibleRouteStopLabels.has(stop.label);

        if (vehicleMode === ReusableComponentsVehicleModeEnum.Bus) {
          return (
            stopFilters[FilterType.ShowAllBusStops] || isStopInVisibleRoutes
          );
        }

        if (vehicleMode === ReusableComponentsVehicleModeEnum.Tram) {
          return (
            stopFilters[FilterType.ShowAllTramStops] || isStopInVisibleRoutes
          );
        }

        return (
          stopFilters[FilterType.ShowAllBusStops] ||
          stopFilters[FilterType.ShowAllTramStops] ||
          isStopInVisibleRoutes
        );
      }),
    [getStopVehicleMode, stopFilters, visibleRouteStopLabels],
  );
}
