import { useMemo } from 'react';
import { StopRegistryTransportModeType } from '../../../generated/graphql';
import { FilterType, selectMapFilter, useAppSelector } from '../../../redux';
import { parseStopRegistryTransportMode } from '../../../utils';
import { MapStopArea } from '../Types';

export function useFilterStopAreas(
  areas: ReadonlyArray<MapStopArea>,
): ReadonlyArray<MapStopArea> {
  const { timeAndPriorityFilters } = useAppSelector(selectMapFilter);

  return useMemo(
    () =>
      areas.filter((area) => {
        const mode = parseStopRegistryTransportMode(area.transport_mode);
        switch (mode) {
          case StopRegistryTransportModeType.Bus:
            return timeAndPriorityFilters[FilterType.ShowAllBusStops];
          case StopRegistryTransportModeType.Tram:
            return timeAndPriorityFilters[FilterType.ShowAllTramStops];
          default:
            return true;
        }
      }),
    [areas, timeAndPriorityFilters],
  );
}
