import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import partial from 'lodash/partial';
import { DateTime } from 'luxon';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ServicePatternScheduledStopPoint } from '../generated/graphql';
import {
  FilterType,
  selectMapFilter,
  selectMapObservationDate,
  setShowStopFilterOverlayAction,
  setStopFilterAction,
} from '../redux';
import { Priority } from '../types/Priority';
import { useAppDispatch, useAppSelector } from './redux';

type StopFilterFunction = (stop: ServicePatternScheduledStopPoint) => boolean;

interface Filter {
  type: FilterType;
  label: string;
  filterFunction: (stop: ServicePatternScheduledStopPoint) => boolean;
}

export interface FilterItem {
  id: string;
  isActive: boolean;
  label: string;
  toggleFunction: (isActive: boolean) => void;
  filterFunction: StopFilterFunction;
  disabled: boolean;
}

const isFutureStop = (
  observationDate: DateTime,
  stop: ServicePatternScheduledStopPoint,
) => {
  // if stop has been valid indefinitely from the start, it can never be a future stop
  if (!stop.validity_start) {
    return false;
  }

  // otherwise its validity has to start after the observation date
  return stop.validity_start > observationDate;
};

const isPastStop = (
  observationDate: DateTime,
  stop: ServicePatternScheduledStopPoint,
) => {
  // if stop is valid indefinitely, it can never be a past stop
  if (!stop.validity_end) {
    return false;
  }

  // otherwise its validity has to end before the observation date
  return stop.validity_end < observationDate;
};

const isCurrentStop = (
  observationDate: DateTime,
  stop: ServicePatternScheduledStopPoint,
) => {
  return (
    !isPastStop(observationDate, stop) && !isFutureStop(observationDate, stop)
  );
};

const mapFilterItemsToFilterFunctions = (filterItems: FilterItem[]) =>
  filterItems
    .filter((item) => item.isActive)
    .map((item) => item.filterFunction);

const hasPriority = (
  priority: Priority,
  stop: ServicePatternScheduledStopPoint,
) => stop.priority === priority;

export const filterHighestPriorityCurrentStops = (
  stops: ServicePatternScheduledStopPoint[],
  observationDate: DateTime,
  allowDrafts = false,
) => {
  // Get all current stops
  const currentStops = stops.filter(
    (stop: ServicePatternScheduledStopPoint) =>
      isCurrentStop(observationDate, stop) &&
      (allowDrafts || !hasPriority(Priority.Draft, stop)),
  );

  // Group stops by label
  const groupedCurrentStops = groupBy(currentStops, 'label');

  // Pick stop instance with the highest priority for each stop label
  return Object.values(groupedCurrentStops).flatMap(
    (stopInstances) =>
      maxBy(stopInstances, 'priority') as ServicePatternScheduledStopPoint,
  );
};

export const useFilterStops = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { stopFilters, showStopFilterOverlay } =
    useAppSelector(selectMapFilter);
  const observationDate = useAppSelector(selectMapObservationDate);

  const highestPriorityCurrentFilter = useMemo(
    () => ({
      type: FilterType.ShowHighestPriorityCurrentStops,
      label: t('filters.highestPriorityCurrent'),
      // Current stops that are not drafts
      filterFunction: (stop: ServicePatternScheduledStopPoint) =>
        isCurrentStop(observationDate, stop) &&
        !hasPriority(Priority.Draft, stop),
    }),
    [observationDate, t],
  );

  const timeBasedFilters = useMemo(
    () => [
      {
        type: FilterType.ShowFutureStops,
        label: t('filters.future'),
        filterFunction: partial(isFutureStop, observationDate),
      },
      {
        type: FilterType.ShowCurrentStops,
        label: t('filters.current'),
        filterFunction: partial(isCurrentStop, observationDate),
      },
      {
        type: FilterType.ShowPastStops,
        label: t('filters.past'),
        filterFunction: partial(isPastStop, observationDate),
      },
    ],
    [observationDate, t],
  );

  const priorityFilters = useMemo(
    () => [
      {
        type: FilterType.ShowStandardStops,
        label: t('filters.standard'),
        filterFunction: partial(hasPriority, Priority.Standard),
      },
      {
        type: FilterType.ShowTemporaryStops,
        label: t('filters.temporary'),
        filterFunction: partial(hasPriority, Priority.Temporary),
      },
      {
        type: FilterType.ShowDraftStops,
        label: t('filters.draft'),
        filterFunction: partial(hasPriority, Priority.Draft),
      },
    ],
    [t],
  );

  const toggleFunction = useCallback(
    (filterType: FilterType) => {
      return (isActive: boolean) =>
        dispatch(setStopFilterAction({ filterType, isActive }));
    },
    [dispatch],
  );

  const isFilterActive = useCallback(
    (filterType: FilterType) => stopFilters[filterType],
    [stopFilters],
  );

  const mapFilterToFilterItem = useCallback(
    (filter: Filter): FilterItem => {
      const { type, label, filterFunction } = filter;

      return {
        id: `filter-${type}`,
        isActive: isFilterActive(type),
        label,
        toggleFunction: toggleFunction(type),
        filterFunction,
        // If "Show situation on the selected date" -filter is active
        // all other filters are disabled
        disabled:
          type !== FilterType.ShowHighestPriorityCurrentStops &&
          isFilterActive(FilterType.ShowHighestPriorityCurrentStops),
      };
    },
    [isFilterActive, toggleFunction],
  );

  const timeBasedFilterItems: FilterItem[] = useMemo(
    () => timeBasedFilters.map(mapFilterToFilterItem),
    [mapFilterToFilterItem, timeBasedFilters],
  );

  const priorityFilterItems: FilterItem[] = useMemo(
    () => priorityFilters.map(mapFilterToFilterItem),
    [mapFilterToFilterItem, priorityFilters],
  );

  const highestPriorityCurrentFilterItem = useMemo(
    () => mapFilterToFilterItem(highestPriorityCurrentFilter),
    [highestPriorityCurrentFilter, mapFilterToFilterItem],
  );

  const filter = useCallback(
    (stops: ServicePatternScheduledStopPoint[]) => {
      // If "Show situation on the selected date" filter is selected,
      // ignore other filters
      if (isFilterActive(FilterType.ShowHighestPriorityCurrentStops)) {
        return filterHighestPriorityCurrentStops(stops, observationDate);
      }

      const timeBasedFilterFunctions =
        mapFilterItemsToFilterFunctions(timeBasedFilterItems);
      const priorityFilterFunctions =
        mapFilterItemsToFilterFunctions(priorityFilterItems);

      return stops.filter(
        (stop) =>
          timeBasedFilterFunctions.some((filterFunction) =>
            filterFunction(stop),
          ) &&
          priorityFilterFunctions.some((filterFunction) =>
            filterFunction(stop),
          ),
      );
    },
    [
      isFilterActive,
      priorityFilterItems,
      timeBasedFilterItems,
      observationDate,
    ],
  );

  const toggleShowFilters = useCallback(() => {
    dispatch(setShowStopFilterOverlayAction(!showStopFilterOverlay));
  }, [dispatch, showStopFilterOverlay]);

  return {
    filter,
    timeBasedFilterItems,
    priorityFilterItems,
    highestPriorityCurrentFilterItem,
    toggleShowFilters,
  };
};
