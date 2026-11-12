import { useTranslation } from 'react-i18next';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import {
  FilterType,
  selectMapFilter,
  setTimeAndPriorityFilterAction,
  useAppDispatch,
  useAppSelector,
} from '../../../redux';
import { parseVehicleMode, showWarningToast } from '../../../utils';

const vehicleModeToFilterType: Partial<
  Record<ReusableComponentsVehicleModeEnum, FilterType>
> = {
  [ReusableComponentsVehicleModeEnum.Bus]: FilterType.ShowAllBusStops,
  [ReusableComponentsVehicleModeEnum.Tram]: FilterType.ShowAllTramStops,
};

/**
 * Ensures the stop vehicle mode filter (bus/tram) is turned on.
 * If the filter is currently off, it will be enabled and a warning toast is shown.
 *
 * This is used after creating a stop area so that the user can immediately see
 * the stops of the correct vehicle mode on the map.
 */
export function useEnsureStopVehicleModeVisible() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { timeAndPriorityFilters } = useAppSelector(selectMapFilter);

  return (transportMode: string | null | undefined) => {
    const vehicleMode = parseVehicleMode(transportMode);
    if (!vehicleMode) {
      return;
    }

    const filterType = vehicleModeToFilterType[vehicleMode];
    if (!filterType) {
      return;
    }

    if (!timeAndPriorityFilters[filterType]) {
      dispatch(setTimeAndPriorityFilterAction({ filterType, isActive: true }));
      showWarningToast(t(($) => $.filters.visibilityFiltersAdjusted));
    }
  };
}
