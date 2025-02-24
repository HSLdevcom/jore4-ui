import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  FilterType,
  selectMapFilter,
  setStopFilterAction,
} from '../../../redux';
import { FilterItem } from './types';

type FilterTypeAndLabel = {
  readonly label: (t: TFunction) => string;
  readonly type: FilterType;
};

const highestPriorityCurrentFilter: FilterTypeAndLabel = {
  type: FilterType.ShowHighestPriorityCurrentStops,
  label: (t) => t('filters.highestPriorityCurrent'),
};

const timeBasedFilters: ReadonlyArray<FilterTypeAndLabel> = [
  {
    type: FilterType.ShowFutureStops,
    label: (t) => t('filters.future'),
  },
  {
    type: FilterType.ShowCurrentStops,
    label: (t) => t('filters.current'),
  },
  {
    type: FilterType.ShowPastStops,
    label: (t) => t('filters.past'),
  },
];

const priorityBasedFilters: ReadonlyArray<FilterTypeAndLabel> = [
  {
    type: FilterType.ShowStandardStops,
    label: (t) => t('filters.standard'),
  },
  {
    type: FilterType.ShowTemporaryStops,
    label: (t) => t('filters.temporary'),
  },
  {
    type: FilterType.ShowDraftStops,
    label: (t) => t('filters.draft'),
  },
];

type TimeAndPriorityFilters = {
  readonly highestPriorityCurrentFilter: FilterItem;
  readonly timeBasedFilters: ReadonlyArray<FilterItem>;
  readonly priorityBasedFilters: ReadonlyArray<FilterItem>;
};

function useMapFilterToFilterItem() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { stopFilters } = useAppSelector(selectMapFilter);

  return (filter: FilterTypeAndLabel): FilterItem => {
    const { type, label } = filter;

    return {
      id: `filter-${type}`,
      isActive: stopFilters[type],
      label: label(t),
      toggleFunction: (isActive: boolean) => {
        dispatch(setStopFilterAction({ filterType: type, isActive }));
      },
      // If "Show situation on the selected date" -filter is active
      // all other filters are disabled
      disabled:
        type !== FilterType.ShowHighestPriorityCurrentStops &&
        stopFilters[FilterType.ShowHighestPriorityCurrentStops],
    };
  };
}

export function useTimeAndPriorityFilters(): TimeAndPriorityFilters {
  const mapFilterToFilterItem = useMapFilterToFilterItem();

  return {
    highestPriorityCurrentFilter: mapFilterToFilterItem(
      highestPriorityCurrentFilter,
    ),
    timeBasedFilters: timeBasedFilters.map(mapFilterToFilterItem),
    priorityBasedFilters: priorityBasedFilters.map(mapFilterToFilterItem),
  };
}
