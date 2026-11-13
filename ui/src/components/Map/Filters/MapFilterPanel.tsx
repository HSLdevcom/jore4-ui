import { Dispatch, FC, SetStateAction } from 'react';
import {
  FilterType,
  selectMapFilter,
  setTimeAndPriorityFilterAction,
  useAppDispatch,
  useAppSelector,
} from '../../../redux';
import { FilterPanel } from './FilterPanel';

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
  const { timeAndPriorityFilters } = useAppSelector(selectMapFilter);

  return (
    <FilterPanel
      className={className}
      showRoutes={showRoute}
      onToggleShowRoutes={setShowRoute}
      routesToggleDisabled={!routeDisplayed}
      stops={[
        {
          iconClassName: 'icon-bus',
          active: timeAndPriorityFilters[FilterType.ShowAllBusStops],
          onToggle: (isActive: boolean) =>
            dispatch(
              setTimeAndPriorityFilterAction({
                filterType: FilterType.ShowAllBusStops,
                isActive,
              }),
            ),
          testId: 'FilterPanel::toggleShowAllBusStops',
          tooltip: (t) => t(($) => $.vehicleModeEnum.bus),
          colorClassNames: {
            active: 'bg-tweaked-brand text-white',
            inactive: 'bg-white text-tweaked-brand',
          },
        },
        {
          iconClassName: 'icon-tram',
          activeColorClassName: 'bg-hsl-tram-dark-green text-white',
          inactiveColorClassName: 'bg-white text-hsl-tram-dark-green',
          active: timeAndPriorityFilters[FilterType.ShowAllTramStops],
          onToggle: (isActive: boolean) =>
            dispatch(
              setTimeAndPriorityFilterAction({
                filterType: FilterType.ShowAllTramStops,
                isActive,
              }),
            ),
          testId: 'FilterPanel::toggleShowAllTramStops',
          tooltip: (t) => t(($) => $.vehicleModeEnum.tram),
          colorClassNames: {
            active: 'bg-hsl-tram-green text-white',
            inactive: 'bg-white text-hsl-tram-dark-green',
          },
        },
      ]}
    />
  );
};
