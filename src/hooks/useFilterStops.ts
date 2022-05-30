import partial from 'lodash/partial';
import { DateTime } from 'luxon';
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
  enabled: boolean;
  label: string;
  toggleFunction: (enabled: boolean) => void;
  filterFunction: StopFilterFunction;
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
  filterItems.filter((item) => item.enabled).map((item) => item.filterFunction);

const hasPriority = (
  priority: Priority,
  stop: ServicePatternScheduledStopPoint,
) => stop.priority === priority;

export const useFilterStops = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { stopFilters, showStopFilterOverlay } =
    useAppSelector(selectMapFilter);
  const observationDate = useAppSelector(selectMapObservationDate);

  const timeBasedFilters = [
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
  ];

  const priorityFilters = [
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
  ];

  const toggleFunction = (filterType: FilterType) => {
    return (enabled: boolean) =>
      dispatch(setStopFilterAction({ filterType, enabled }));
  };

  const isFilterEnabled = (filterType: FilterType) => stopFilters[filterType];

  const mapFilterToFilterItem = (filter: Filter): FilterItem => {
    const { type, label, filterFunction } = filter;

    return {
      id: `filter-${type}`,
      enabled: isFilterEnabled(type),
      label,
      toggleFunction: toggleFunction(type),
      filterFunction,
    };
  };

  const timeBasedFilterItems: FilterItem[] = timeBasedFilters.map(
    mapFilterToFilterItem,
  );

  const priorityFilterItems: FilterItem[] = priorityFilters.map(
    mapFilterToFilterItem,
  );

  const filter = (stops: ServicePatternScheduledStopPoint[]) => {
    const timeBasedFilterFunctions =
      mapFilterItemsToFilterFunctions(timeBasedFilterItems);
    const priorityFilterFunctions =
      mapFilterItemsToFilterFunctions(priorityFilterItems);

    return stops.filter(
      (stop) =>
        timeBasedFilterFunctions.some((filterFunction) =>
          filterFunction(stop),
        ) &&
        priorityFilterFunctions.some((filterFunction) => filterFunction(stop)),
    );
  };

  const toggleShowFilters = () => {
    dispatch(setShowStopFilterOverlayAction(!showStopFilterOverlay));
  };

  return {
    filter,
    timeBasedFilterItems,
    priorityFilterItems,
    toggleShowFilters,
  };
};
