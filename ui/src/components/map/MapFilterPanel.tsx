import React, { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { FilterType, selectMapFilter, setStopFilterAction } from '../../redux';
import { FilterPanel, placeholderToggles } from '../../uiComponents';

type MapFilterPanelProps = {
  readonly routeDisplayed: boolean;
  readonly showInfraLinks: boolean;
  readonly showRoute: boolean;
  readonly setShowInfraLinks: Dispatch<SetStateAction<boolean>>;
  readonly setShowRoute: Dispatch<SetStateAction<boolean>>;
};

export const MapFilterPanel: FC<MapFilterPanelProps> = ({
  routeDisplayed,
  showInfraLinks,
  showRoute,
  setShowInfraLinks,
  setShowRoute,
}) => {
  const { t } = useTranslation();

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
          tooltip: t('vehicleModeEnum.bus'),
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
          tooltip: t('vehicleModeEnum.bus'),
        },
        ...placeholderToggles,
      ]}
      infraLinks={{
        active: showInfraLinks,
        onToggle: setShowInfraLinks,
        testId: 'FilterPanel::toggleShowInfraLinks',
      }}
    />
  );
};
