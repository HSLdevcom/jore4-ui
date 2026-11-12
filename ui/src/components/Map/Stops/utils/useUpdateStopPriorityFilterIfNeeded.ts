import { useTranslation } from 'react-i18next';
import {
  FilterType,
  selectMapFilter,
  setTimeAndPriorityFilterAction,
  useAppDispatch,
  useAppSelector,
} from '../../../../redux';
import { Priority } from '../../../../types/enums';
import { showWarningToast } from '../../../../utils';

function mapPriorityToFilterType(priority: Priority): FilterType {
  switch (priority) {
    case Priority.Standard:
      return FilterType.ShowStandard;
    case Priority.Temporary:
      return FilterType.ShowTemporary;
    case Priority.Draft:
    default:
      return FilterType.ShowDraft;
  }
}

export function useUpdateStopPriorityFilterIfNeeded() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { timeAndPriorityFilters } = useAppSelector(selectMapFilter);

  /**
   * If the given priority stops are currently being filtered out from the view
   * -> adjust the priority filters so that the given priority stops are shown and
   * also deactivate the 'ShowHighestPriorityCurrent' filter.
   * -> Show the user toast message about the adjustment.
   */
  return (priority: Priority) => {
    const filterType = mapPriorityToFilterType(priority);

    if (!timeAndPriorityFilters[filterType]) {
      dispatch(
        setTimeAndPriorityFilterAction({
          filterType,
          isActive: true,
        }),
      );
      dispatch(
        setTimeAndPriorityFilterAction({
          filterType: FilterType.ShowHighestPriorityCurrent,
          isActive: false,
        }),
      );
      showWarningToast(t(($) => $.filters.filtersAdjusted));
    }
  };
}
