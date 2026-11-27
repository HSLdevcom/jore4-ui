import partial from 'lodash/partial';
import { useCallback } from 'react';
import {
  ActiveTimeAndPriorityFilters,
  FilterType,
  priorityFilterTypes,
  priorityFilters,
  selectMapFilter,
  useAppSelector,
} from '../../../redux';
import { FilterableStopInfo } from '../../../types';
import {
  filterHighestPriorityCurrentStops,
  isCurrentEntity,
  isFutureEntity,
  isPastEntity,
} from '../../../utils';
import { useMapObservationDate } from './mapUrlState';
import { useIsInSearchResultMode } from './useIsInSearchResultMode';

type FilterStopsFn = <TStop extends FilterableStopInfo>(
  stops: ReadonlyArray<TStop>,
) => ReadonlyArray<TStop>;

type TypeAndFilterFn = {
  readonly type: FilterType;
  readonly filterFunction: (stop: FilterableStopInfo) => boolean;
};

function getActiveTimeFilters(
  observationDate: Temporal.PlainDate,
  filters: ActiveTimeAndPriorityFilters,
): ReadonlyArray<TypeAndFilterFn> {
  return [
    {
      type: FilterType.ShowFuture,
      filterFunction: partial(isFutureEntity, observationDate),
    },
    {
      type: FilterType.ShowCurrent,
      filterFunction: partial(isCurrentEntity, observationDate),
    },
    {
      type: FilterType.ShowPast,
      filterFunction: partial(isPastEntity, observationDate),
    },
  ].filter(({ type }) => filters[type]);
}

function getActivePriorityFilters(
  filters: ActiveTimeAndPriorityFilters,
): ReadonlyArray<TypeAndFilterFn> {
  return priorityFilterTypes
    .filter((type) => filters[type])
    .map((type) => ({
      type,
      filterFunction: (stop) => priorityFilters[type].includes(stop.priority),
    }));
}

function filterStopsByAnyTimeAndPriority<TStop extends FilterableStopInfo>(
  stops: ReadonlyArray<TStop>,
  observationDate: Temporal.PlainDate,
  filters: ActiveTimeAndPriorityFilters,
): Array<TStop> {
  const activeTimeFilters = getActiveTimeFilters(observationDate, filters);
  const activePriorityFilters = getActivePriorityFilters(filters);

  return stops.filter(
    (stop) =>
      activeTimeFilters.some(({ filterFunction }) => filterFunction(stop)) &&
      activePriorityFilters.some(({ filterFunction }) => filterFunction(stop)),
  );
}

function filterStopsByTimeAndPriority<TStop extends FilterableStopInfo>(
  stops: ReadonlyArray<TStop>,
  observationDate: Temporal.PlainDate,
  filters: ActiveTimeAndPriorityFilters,
): Array<TStop> {
  // If "Show situation on the selected date" filter is selected,
  // ignore other filters
  if (filters[FilterType.ShowHighestPriorityCurrent]) {
    return filterHighestPriorityCurrentStops(stops, observationDate);
  }

  return filterStopsByAnyTimeAndPriority(stops, observationDate, filters);
}

export function useFilterStops(): FilterStopsFn {
  const { timeAndPriorityFilters } = useAppSelector(selectMapFilter);
  const observationDate = useMapObservationDate();

  const isInSearchResultMode = useIsInSearchResultMode();

  return useCallback(
    (stops) => {
      if (isInSearchResultMode) {
        return stops;
      }

      return filterStopsByTimeAndPriority(
        stops,
        observationDate,
        timeAndPriorityFilters,
      );
    },
    [observationDate, timeAndPriorityFilters, isInSearchResultMode],
  );
}
