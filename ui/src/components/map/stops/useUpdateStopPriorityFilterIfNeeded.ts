import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { FilterType, selectMapFilter, setStopFilterAction } from '../../../redux';
import { Priority } from '../../../types/enums';
import { showWarningToast } from '../../../utils';

function mapPriorityToFilterType(priority: Priority): FilterType {
  switch (priority) {
    case Priority.Standard:
      return FilterType.ShowStandardStops;
    case Priority.Temporary:
      return FilterType.ShowTemporaryStops;
    case Priority.Draft:
    default:
      return FilterType.ShowDraftStops;
  }
}

export function useUpdateStopPriorityFilterIfNeeded() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { stopFilters } = useAppSelector(selectMapFilter);

  /**
   * If the given priority stops are currently being filtered out from the view
   * -> adjust the priority filters so that the given priority stops are shown and
   * also deactivate the 'showHighestPriorityCurrentStops' filter.
   * -> Show the user toast message about the adjustment.
   */
  return (priority: Priority) => {
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
  }
}
