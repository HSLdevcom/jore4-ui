import partial from 'lodash/partial';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { useAppSelector } from '../../../../hooks';
import {
  ActiveStopFilters,
  FilterType,
  selectMapFilter,
} from '../../../../redux';
import { FilterableStopInfo } from '../../../../types';
import { Priority } from '../../../../types/enums';
import {
  filterHighestPriorityCurrentStops,
  hasPriority,
  isCurrentEntity,
  isFutureEntity,
  isPastEntity,
} from '../../../../utils';
import { useMapObservationDate } from '../../utils/mapUrlState';
import { useVisibleRouteStops } from './useVisibleRouteStops';

type FilterStopsFn = <TStop extends FilterableStopInfo>(
  stops: ReadonlyArray<TStop>,
) => Array<TStop>;

function isStopInDisplayedRoutes(
  displayedRouteStopLabels: ReadonlyArray<string>,
  label: string,
) {
  return displayedRouteStopLabels.includes(label);
}

type TypeAndFilterFn = {
  readonly type: FilterType;
  readonly filterFunction: (stop: FilterableStopInfo) => boolean;
};

function getActiveTimeFilters(
  observationDate: DateTime,
  stopFilters: ActiveStopFilters,
): ReadonlyArray<TypeAndFilterFn> {
  return [
    {
      type: FilterType.ShowFutureStops,
      filterFunction: partial(isFutureEntity, observationDate),
    },
    {
      type: FilterType.ShowCurrentStops,
      filterFunction: partial(isCurrentEntity, observationDate),
    },
    {
      type: FilterType.ShowPastStops,
      filterFunction: partial(isPastEntity, observationDate),
    },
  ].filter(({ type }) => stopFilters[type]);
}

function getActivePriorityFilters(
  stopFilters: ActiveStopFilters,
): ReadonlyArray<TypeAndFilterFn> {
  return [
    {
      type: FilterType.ShowStandardStops,
      filterFunction: partial(hasPriority, Priority.Standard),
    },
    {
      type: FilterType.ShowTemporaryStops,
      filterFunction: partial(hasPriority, Priority.Temporary),
    },
    {
      type: FilterType.ShowDraftStops,
      filterFunction: partial(hasPriority, Priority.Draft),
    },
  ].filter(({ type }) => stopFilters[type]);
}

function filterStopsByAnyTimeAndPriority<TStop extends FilterableStopInfo>(
  stops: ReadonlyArray<TStop>,
  observationDate: DateTime,
  stopFilters: ActiveStopFilters,
): Array<TStop> {
  const activeTimeFilters = getActiveTimeFilters(observationDate, stopFilters);
  const activePriorityFilters = getActivePriorityFilters(stopFilters);

  return stops.filter(
    (stop) =>
      activeTimeFilters.some(({ filterFunction }) => filterFunction(stop)) &&
      activePriorityFilters.some(({ filterFunction }) => filterFunction(stop)),
  );
}

function filterStopsByTimeAndPriority<TStop extends FilterableStopInfo>(
  stops: ReadonlyArray<TStop>,
  observationDate: DateTime,
  stopFilters: ActiveStopFilters,
): Array<TStop> {
  // If "Show situation on the selected date" filter is selected,
  // ignore other filters
  if (stopFilters[FilterType.ShowHighestPriorityCurrentStops]) {
    return filterHighestPriorityCurrentStops(stops, observationDate);
  }

  return filterStopsByAnyTimeAndPriority(stops, observationDate, stopFilters);
}

export function useFilterStops(): FilterStopsFn {
  const { stopFilters } = useAppSelector(selectMapFilter);
  const observationDate = useMapObservationDate();

  const { visibleRouteStopLabels } = useVisibleRouteStops();

  return useCallback(
    (stops) => {
      const filteredByTimeAndPriority = filterStopsByTimeAndPriority(
        stops,
        observationDate,
        stopFilters,
      );

      if (stopFilters[FilterType.ShowAllBusStops]) {
        return filteredByTimeAndPriority;
      }

      /**
       * Filter out stops that don't belong to any displayed route, if
       * "Show all stops" -filter is not active
       */
      return filteredByTimeAndPriority.filter((stop) =>
        isStopInDisplayedRoutes(visibleRouteStopLabels, stop.label),
      );
    },
    [observationDate, stopFilters, visibleRouteStopLabels],
  );
}
