import { useTranslation } from 'react-i18next';
import {
  FilterType,
  selectMapFilter,
  setTimeAndPriorityFilterAction,
  useAppDispatch,
  useAppSelector,
} from '../../../../redux';
import { showWarningToast } from '../../../../utils';

/**
 * Ensures the 'ShowCurrent' temporal filter is active.
 * If it is not, it will be enabled and a warning toast is shown.
 *
 * This is used after creating stops so that the user can immediately see the result on the map.
 */
export function useEnsureTemporalFilterActive() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { timeAndPriorityFilters } = useAppSelector(selectMapFilter);

  return () => {
    if (!timeAndPriorityFilters[FilterType.ShowCurrent]) {
      dispatch(
        setTimeAndPriorityFilterAction({
          filterType: FilterType.ShowCurrent,
          isActive: true,
        }),
      );
      showWarningToast(t(($) => $.filters.temporalFiltersAdjusted));
    }
  };
}
