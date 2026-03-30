import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  MapEntityType,
  selectShowMapEntityTypes,
  setShowMapEntityTypeAction,
} from '../../../redux';
import { showWarningToast } from '../../../utils';

/**
 * Ensures the given map entity type filter is turned on.
 * If the filter is currently off, it will be enabled and a warning toast is shown
 * to inform the user about the adjustment.
 *
 * This is used after creating elements (terminals, stop areas, stops) so that
 * the user can immediately see the result of their creation on the map.
 */
export function useEnsureMapEntityTypeVisible() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const showMapEntityType = useAppSelector(selectShowMapEntityTypes);

  return (entityType: MapEntityType) => {
    if (!showMapEntityType[entityType]) {
      dispatch(setShowMapEntityTypeAction({ entityType, shown: true }));
      showWarningToast(t(($) => $.filters.visibilityFiltersAdjusted));
    }
  };
}
