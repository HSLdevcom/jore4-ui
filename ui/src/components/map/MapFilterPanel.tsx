import { Dispatch, FC, SetStateAction } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { FilterType, selectMapFilter, setStopFilterAction } from '../../redux';
import { FilterPanel, placeholderToggles } from './FilterPanel';

type MapFilterPanelProps = {
  readonly routeDisplayed: boolean;
  readonly showRoute: boolean;
  readonly setShowRoute: Dispatch<SetStateAction<boolean>>;
};

export const MapFilterPanel: FC<MapFilterPanelProps> = ({
  routeDisplayed,
  showRoute,
  setShowRoute,
}) => {
  const dispatch = useAppDispatch();
  const { stopFilters } = useAppSelector(selectMapFilter);

  return (
    <FilterPanel
      routes={[
        {
          iconClassName: 'icon-bus',
          active: showRoute,
          onToggle: setShowRoute,
          disabled: !routeDisplayed,
          testId: 'FilterPanel::toggleShowBusRoutes',
          tooltip: (t) => t('vehicleModeEnum.bus'),
        },
        // We want to show placeholder toggles of unimplemented features for visual purposes
        ...placeholderToggles,
      ]}
      stops={[
        {
          iconClassName: 'icon-bus',
          active: stopFilters[FilterType.ShowAllBusStops],
          onToggle: (isActive: boolean) =>
            dispatch(
              setStopFilterAction({
                filterType: FilterType.ShowAllBusStops,
                isActive,
              }),
            ),
          testId: 'FilterPanel::toggleShowAllBusStops',
          tooltip: (t) => t('vehicleModeEnum.bus'),
        },
        ...placeholderToggles,
      ]}
    />
  );
};
