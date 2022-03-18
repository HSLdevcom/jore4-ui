import { DateTime } from 'luxon';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterType, MapFilterContext, setState } from '../context/MapFilter';
import { ServicePatternScheduledStopPoint } from '../generated/graphql';

type StopFilterFunction = (stop: ServicePatternScheduledStopPoint) => boolean;

interface FilterItem {
  id: string;
  enabled: boolean;
  label: string;
  toggleFunction: (enabled: boolean) => void;
  filterFunction: StopFilterFunction;
}

const isFutureStop: (date: DateTime) => StopFilterFunction = (date) => (stop) =>
  DateTime.fromISO(stop.validity_start) > date;

const isCurrentStop: (date: DateTime) => StopFilterFunction =
  (date) => (stop) =>
    DateTime.fromISO(stop.validity_start) <= date &&
    (!stop.validity_end || DateTime.fromISO(stop.validity_end) >= date);

const isPastStop: (date: DateTime) => StopFilterFunction = (date) => (stop) =>
  stop.validity_end && DateTime.fromISO(stop.validity_end) < date;

export const useFilterStops = () => {
  const { t } = useTranslation();

  const {
    state: { stopFilters, observationDate, showStopFilterOverlay },
    dispatch,
  } = useContext(MapFilterContext);

  const timeBasedFilters = [
    {
      type: FilterType.ShowFutureStops,
      label: t('filters.future'),
      filterFunction: isFutureStop(observationDate),
    },
    {
      type: FilterType.ShowCurrentStops,
      label: t('filters.current'),
      filterFunction: isCurrentStop(observationDate),
    },
    {
      type: FilterType.ShowPastStops,
      label: t('filters.past'),
      filterFunction: isPastStop(observationDate),
    },
  ];

  const setFilterEnabled = (filterType: FilterType, enabled: boolean) => {
    const newStopFilters = stopFilters.map((filter) =>
      filter.type === filterType ? { type: filterType, enabled } : filter,
    );
    dispatch(setState({ stopFilters: newStopFilters }));
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

  const toggleShowFilters = () => {
    dispatch(setState({ showStopFilterOverlay: !showStopFilterOverlay }));
  };

  return { filter, timeBasedFilterItems, toggleShowFilters };
};
