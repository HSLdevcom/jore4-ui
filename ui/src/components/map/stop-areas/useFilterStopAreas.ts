import { useMemo } from 'react';
import { StopRegistryTransportModeType } from '../../../generated/graphql';
import { useAppSelector } from '../../../hooks';
import { FilterType, selectMapFilter } from '../../../redux';
import { parseStopRegistryTransportMode } from '../../../utils';
import { MapStopArea } from '../types';

export function useFilterStopAreas(
  areas: ReadonlyArray<MapStopArea>,
): ReadonlyArray<MapStopArea> {
  const { stopFilters } = useAppSelector(selectMapFilter);

  return useMemo(
    () =>
      areas.filter((area) => {
        const mode = parseStopRegistryTransportMode(area.transport_mode);
        switch (mode) {
          case StopRegistryTransportModeType.Bus:
            return stopFilters[FilterType.ShowAllBusStops];
          case StopRegistryTransportModeType.Tram:
            return stopFilters[FilterType.ShowAllTramStops];
          default:
            return true;
        }
      }),
    [areas, stopFilters],
  );
}
