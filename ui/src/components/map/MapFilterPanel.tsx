import { Dispatch, FC, SetStateAction } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { FilterType, selectMapFilter, setStopFilterAction } from '../../redux';
import { FilterPanel, placeholderToggles } from './FilterPanel';

type MapFilterPanelProps = {
  readonly routeDisplayed: boolean;
  readonly showRoute: boolean;
  readonly setShowRoute: Dispatch<SetStateAction<boolean>>;
  readonly className?: string;
};

export const MapFilterPanel: FC<MapFilterPanelProps> = ({
  routeDisplayed,
  showRoute,
  setShowRoute,
  className,
}) => {
  const dispatch = useAppDispatch();
  const { stopFilters } = useAppSelector(selectMapFilter);

  return (
    <FilterPanel
      className={className}
      routes={[
        {
          iconClassName: 'icon-bus',
          active: showRoute,
          onToggle: setShowRoute,
          disabled: !routeDisplayed,
          testId: 'FilterPanel::toggleShowBusRoutes',
          tooltip: (t) => t('vehicleModeEnum.bus'),
          colorClassNames: {
            active: 'bg-tweaked-brand text-white',
            inactive: 'bg-white text-tweaked-brand',
          },
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
          colorClassNames: {
            active: 'bg-tweaked-brand text-white',
            inactive: 'bg-white text-tweaked-brand',
          },
        },
        {
          iconClassName: 'icon-tram',
          active: stopFilters[FilterType.ShowAllTramStops],
          onToggle: (isActive: boolean) =>
            dispatch(
              setStopFilterAction({
                filterType: FilterType.ShowAllTramStops,
                isActive,
              }),
            ),
          testId: 'FilterPanel::toggleShowAllTramStops',
          tooltip: (t) => t('vehicleModeEnum.tram'),
          colorClassNames: {
            active: 'bg-hsl-tram-green text-white',
            inactive: 'bg-white text-hsl-tram-dark-green',
          },
        },
        ...placeholderToggles,
      ]}
    />
  );
};
