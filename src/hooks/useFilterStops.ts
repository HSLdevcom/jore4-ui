import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MapFilterContext } from '../context/MapFilterContext';
import { FilterType } from '../context/MapFilterReducer';
import { ServicePatternScheduledStopPoint } from '../generated/graphql';

type StopFilterFunction = (stop: ServicePatternScheduledStopPoint) => boolean;

interface FilterItem {
  id: string;
  enabled: boolean;
  label: string;
  toggleFunction: (enabled: boolean) => void;
  filterFunction: StopFilterFunction;
}

const isFutureStop: (date: Date) => StopFilterFunction = (date) => (stop) =>
  stop.validity_start > date.toISOString();

const isCurrentStop: (date: Date) => StopFilterFunction = (date) => (stop) =>
  stop.validity_start < date.toISOString() &&
  stop.validity_end > date.toISOString();

const isPastStop: (date: Date) => StopFilterFunction = (date) => (stop) =>
  stop.validity_end < date.toISOString();

export const useFilterStops = () => {
  const { t } = useTranslation();

  // TODO: Get this from context when time of review date setting has been implemented
  const timeOfReview = new Date();

  const {
    state: { stopFilters },
    dispatch,
  } = useContext(MapFilterContext);

  const timeBasedFilters = [
    {
      type: FilterType.ShowFutureStops,
      label: t('filters.future'),
      filterFunction: isFutureStop(timeOfReview),
    },
    {
      type: FilterType.ShowCurrentStops,
      label: t('filters.current'),
      filterFunction: isCurrentStop(timeOfReview),
    },
    {
      type: FilterType.ShowPastStops,
      label: t('filters.past'),
      filterFunction: isPastStop(timeOfReview),
    },
  ];

  const setFilterEnabled = (filterType: FilterType, enabled: boolean) => {
    const newStopFilters = stopFilters.map((filter) =>
      filter.type === filterType ? { type: filterType, enabled } : filter,
    );
    dispatch({ type: 'setState', payload: { stopFilters: newStopFilters } });
  };

  const toggleFunction = (filterType: FilterType) => {
    return (enabled: boolean) => setFilterEnabled(filterType, enabled);
  };

  const isFilterEnabled = (filterType: FilterType) =>
    !!stopFilters.find((item) => item.type === filterType)?.enabled;

  const timeBasedFilterItems: FilterItem[] = timeBasedFilters.map((item) => {
    const { type, label, filterFunction } = item;

    return {
      id: `filter-${type}`,
      enabled: isFilterEnabled(type),
      label,
      toggleFunction: toggleFunction(type),
      filterFunction,
    };
  });

  const filter = (stops: ServicePatternScheduledStopPoint[]) => {
    const timeBasedFilterFunctions = timeBasedFilterItems
      .filter((item) => item.enabled)
      .map((item) => item.filterFunction);

    return stops.filter((stop) =>
      timeBasedFilterFunctions.some((filterFunction) => filterFunction(stop)),
    );
  };

  return { filter, timeBasedFilterItems };
};
