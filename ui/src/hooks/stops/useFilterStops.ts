import { GeoJSON } from 'geojson';
import partial from 'lodash/partial';
import { DateTime } from 'luxon';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StopDetails } from '../../components/map/useMapData';
import {
  ReusableComponentsVehicleModeEnum,
  ScheduledStopPointAllFieldsFragment,
} from '../../generated/graphql';
import { StopWithLocation } from '../../graphql';
import {
  FilterType,
  selectMapFilter,
  setShowMapEntityTypeFilterOverlayAction,
  setStopFilterAction,
} from '../../redux';
import { Priority } from '../../types/enums';
import {
  filterHighestPriorityCurrentStops,
  hasPriority,
  isCurrentEntity,
  isFutureEntity,
  isPastEntity,
  showWarningToast,
} from '../../utils';
import { useAppDispatch, useAppSelector } from '../redux';
import { useObservationDateQueryParam } from '../urlQuery';
import { useVisibleRouteStops } from './useVisibleRouteStops';

export type FilterableStopType =
  | ScheduledStopPointAllFieldsFragment
  | StopDetails;

// TODO: Strip ScheduledStopPointAllFieldsFragment and use quay values
export class FilterableStop<T extends FilterableStopType> {
  stop: T;

  validity_start: DateTime | undefined;

  validity_end: DateTime | undefined;

  priority: number;

  label: string;

  measured_location: GeoJSON.Point;

  scheduled_stop_point_id: string;

  vehicle_mode_on_scheduled_stop_point: Array<{
    vehicle_mode: ReusableComponentsVehicleModeEnum;
  }>;

  closest_point_on_infrastructure_link: GeoJSON.Point | undefined;

  constructor(entity: ScheduledStopPointAllFieldsFragment | StopDetails) {
    this.stop = entity as T;

    if (FilterableStop.isScheduledStopPointAllFieldsFragment(entity)) {
      this.asStopWithLocation = () => {
        return this.stop as StopWithLocation;
      };

      this.validity_start = entity.validity_start ?? undefined;
      this.validity_end = entity.validity_end ?? undefined;
      this.priority = entity.priority ?? -1;
      this.label = entity.label ?? '';
      this.measured_location = entity.measured_location;
      this.scheduled_stop_point_id = entity.scheduled_stop_point_id;
      this.vehicle_mode_on_scheduled_stop_point =
        entity.vehicle_mode_on_scheduled_stop_point;
      this.closest_point_on_infrastructure_link =
        entity.closest_point_on_infrastructure_link ?? undefined;
    } else {
      this.asStopWithLocation = () => {
        return entity.stopPoint as StopWithLocation;
      };

      this.validity_start =
        entity?.scheduled_stop_point?.validity_start ?? undefined;
      this.validity_end =
        entity?.scheduled_stop_point?.validity_end ?? undefined;

      this.priority = entity?.stopPoint?.priority ?? -1;
      this.label = entity?.stopPoint?.label ?? '';

      this.measured_location = entity.stopPoint.measured_location;

      this.scheduled_stop_point_id = entity?.stopPoint.scheduled_stop_point_id;

      this.vehicle_mode_on_scheduled_stop_point =
        entity?.stopPoint?.vehicle_mode_on_scheduled_stop_point;

      this.closest_point_on_infrastructure_link =
        entity.stopPoint.closest_point_on_infrastructure_link ?? undefined;
    }
  }

  asStopWithLocation: () => StopWithLocation;

  private static isScheduledStopPointAllFieldsFragment = (
    entity: ScheduledStopPointAllFieldsFragment | StopDetails,
  ): entity is ScheduledStopPointAllFieldsFragment =>
    'validity_start' in entity;
}

type StopFilterFunction<T extends FilterableStopType> = <
  TStop extends FilterableStop<T>,
>(
  stop: TStop,
) => boolean;

interface Filter<T extends FilterableStopType> {
  type: FilterType;
  label: string;
  filterFunction: <TStop extends FilterableStop<T>>(stop: TStop) => boolean;
}

export interface FilterItem<T extends FilterableStopType> {
  id: string;
  isActive: boolean;
  label: string;
  toggleFunction: (isActive: boolean) => void;
  filterFunction: StopFilterFunction<T>;
  disabled: boolean;
}

const mapFilterItemsToFilterFunctions = (
  filterItems: FilterItem<StopDetails>[],
) =>
  filterItems
    .filter((item) => item.isActive)
    .map((item) => item.filterFunction);

const isStopInDisplayedRoutes = (
  displayedRouteStopLabels: string[],
  label: string,
) => displayedRouteStopLabels.includes(label);

export const useFilterStops = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { visibleRouteStopLabels } = useVisibleRouteStops();

  const { stopFilters, showMapEntityTypeFilterOverlay } =
    useAppSelector(selectMapFilter);
  const { observationDate } = useObservationDateQueryParam();

  const highestPriorityCurrentFilter = useMemo(
    () => ({
      type: FilterType.ShowHighestPriorityCurrentStops,
      label: t('filters.highestPriorityCurrent'),
      // Current stops that are not drafts
      filterFunction: <TStop extends FilterableStop<StopDetails>>(
        stop: TStop,
      ) =>
        isCurrentEntity(observationDate, stop) &&
        !hasPriority(Priority.Draft, stop),
    }),
    [observationDate, t],
  );

  const timeBasedFilters = useMemo(
    () => [
      {
        type: FilterType.ShowFutureStops,
        label: t('filters.future'),
        filterFunction: partial(isFutureEntity, observationDate),
      },
      {
        type: FilterType.ShowCurrentStops,
        label: t('filters.current'),
        filterFunction: partial(isCurrentEntity, observationDate),
      },
      {
        type: FilterType.ShowPastStops,
        label: t('filters.past'),
        filterFunction: partial(isPastEntity, observationDate),
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
    (filter: Filter<StopDetails>): FilterItem<StopDetails> => {
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

  const timeBasedFilterItems: FilterItem<StopDetails>[] = useMemo(
    () => timeBasedFilters.map(mapFilterToFilterItem),
    [mapFilterToFilterItem, timeBasedFilters],
  );

  const priorityFilterItems: FilterItem<StopDetails>[] = useMemo(
    () => priorityFilters.map(mapFilterToFilterItem),
    [mapFilterToFilterItem, priorityFilters],
  );

  const highestPriorityCurrentFilterItem = useMemo(
    () => mapFilterToFilterItem(highestPriorityCurrentFilter),
    [highestPriorityCurrentFilter, mapFilterToFilterItem],
  );

  const filter = useCallback(
    <TStop extends FilterableStop<StopDetails>>(stops: TStop[]) => {
      let filteredStops = [];
      // If "Show situation on the selected date" filter is selected,
      // ignore other filters
      if (isFilterActive(FilterType.ShowHighestPriorityCurrentStops)) {
        filteredStops = filterHighestPriorityCurrentStops(
          stops,
          observationDate,
        );
      } else {
        const timeBasedFilterFunctions =
          mapFilterItemsToFilterFunctions(timeBasedFilterItems);
        const priorityFilterFunctions =
          mapFilterItemsToFilterFunctions(priorityFilterItems);

        filteredStops = stops.filter(
          (stop) =>
            timeBasedFilterFunctions.some((filterFunction) =>
              filterFunction(stop),
            ) &&
            priorityFilterFunctions.some((filterFunction) =>
              filterFunction(stop),
            ),
        );
      }

      /**
       * Filter out stops that don't belong to any displayed route, if
       * "Show all stops" -filter is not active
       */
      return filteredStops.filter(
        (stop) =>
          isFilterActive(FilterType.ShowAllBusStops) ||
          isStopInDisplayedRoutes(visibleRouteStopLabels, stop.label),
      );
    },
    [
      isFilterActive,
      timeBasedFilterItems,
      priorityFilterItems,
      observationDate,
      visibleRouteStopLabels,
    ],
  );

  const toggleShowFilters = useCallback(() => {
    dispatch(
      setShowMapEntityTypeFilterOverlayAction(!showMapEntityTypeFilterOverlay),
    );
  }, [dispatch, showMapEntityTypeFilterOverlay]);

  const mapPriorityToFilterType = (priority: Priority) => {
    switch (priority) {
      case Priority.Standard:
        return FilterType.ShowStandardStops;
      case Priority.Temporary:
        return FilterType.ShowTemporaryStops;
      case Priority.Draft:
      default:
        return FilterType.ShowDraftStops;
    }
  };

  /**
   * If the given priority stops are currently being filtered out from the view
   * -> adjust the priority filters so that the given priority stops are shown and
   * also deactivate the 'showHighestPriorityCurrentStops' filter.
   * -> Show the user toast message about the adjustment.
   */
  const updateStopPriorityFilterIfNeeded = (priority: Priority) => {
    const filterType = mapPriorityToFilterType(priority);

    if (!stopFilters[filterType]) {
      dispatch(
        setStopFilterAction({
          filterType,
          isActive: true,
        }),
      );
      dispatch(
        setStopFilterAction({
          filterType: FilterType.ShowHighestPriorityCurrentStops,
          isActive: false,
        }),
      );
      showWarningToast(t('filters.stopFiltersAdjusted'));
    }
  };

  return {
    filter,
    timeBasedFilterItems,
    priorityFilterItems,
    highestPriorityCurrentFilterItem,
    toggleShowFilters,
    toggleFunction,
    isFilterActive,
    updateStopPriorityFilterIfNeeded,
  };
};
