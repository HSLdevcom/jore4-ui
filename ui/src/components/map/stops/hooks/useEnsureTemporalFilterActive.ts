import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import {
  FilterType,
  selectMapFilter,
  setStopFilterAction,
} from '../../../../redux';
import { showWarningToast } from '../../../../utils';

/**
 * Ensures the 'ShowCurrentStops' temporal filter is active.
 * If it is not, it will be enabled and a warning toast is shown.
 *
 * This is used after creating stops so that the user can immediately see the result on the map.
 */
export function useEnsureTemporalFilterActive() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { stopFilters } = useAppSelector(selectMapFilter);

  return () => {
    if (!stopFilters[FilterType.ShowCurrentStops]) {
      dispatch(
        setStopFilterAction({
          filterType: FilterType.ShowCurrentStops,
          isActive: true,
        }),
      );
      showWarningToast(t('filters.temporalFiltersAdjusted'));
    }
  };
}
