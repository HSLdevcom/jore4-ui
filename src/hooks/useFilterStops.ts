import partial from 'lodash/partial';
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
