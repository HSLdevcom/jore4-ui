import { TFunction } from 'i18next';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLayers } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { Row } from '../../layoutComponents';
import {
  selectMapFilter,
  setShowMapEntityTypeFilterOverlayAction,
} from '../../redux';
import { IconButton } from '../../uiComponents/IconButton';
import { IconToggle } from '../../uiComponents/IconToggle';
import { MapObservationDateControl } from './MapObservationDateControl';

const testIds = {
  toggleFiltersButton: 'ObservationDateOverlay::toggleFiltersButton',
};

type Toggle = {
  readonly active: boolean;
  readonly onToggle: (active: boolean) => void;
  readonly testId: string;
};

type IconToggle = Toggle & {
  readonly iconClassName: string;
  readonly disabled?: boolean;
  readonly tooltip: (t: TFunction) => string;
};

type ToggleRowProps = {
  readonly toggles: ReadonlyArray<IconToggle>;
};

const ToggleRow: FC<ToggleRowProps> = ({ toggles }) => {
  const { t } = useTranslation();

  return (
    <Row>
      {toggles.map(
        (
          { active, onToggle, iconClassName, disabled, testId, tooltip },
          index: number,
        ) => (
          <IconToggle
            // We don't have proper ids to use as keys here.
            // This shouldn't matter as this array isn't dynamic.
            key={index} // eslint-disable-line react/no-array-index-key
            iconClassName={iconClassName}
            className="mr-1.5"
            active={active}
            onToggle={onToggle}
            disabled={disabled}
            testId={testId}
            tooltip={tooltip(t)}
          />
        ),
      )}
    </Row>
  );
};

const noop = () => null;
// placeholder toggles of unimplemented features that can be used
// for visual purposes.
export const placeholderToggles: ReadonlyArray<IconToggle> = [
  {
    iconClassName: 'icon-train',
    active: false,
    onToggle: noop,
    disabled: true,
    testId: 'placeholder',
    tooltip: (t) => t('vehicleModeEnum.train'),
  },
  {
    iconClassName: 'icon-ferry',
    active: false,
    onToggle: noop,
    disabled: true,
    testId: 'placeholder',
    tooltip: (t) => t('vehicleModeEnum.ferry'),
  },
  {
    iconClassName: 'icon-metro',
    active: false,
    onToggle: noop,
    disabled: true,
    testId: 'placeholder',
    tooltip: (t) => t('vehicleModeEnum.metro'),
  },
];

type FilterPanelProps = {
  readonly routes: ReadonlyArray<IconToggle>;
  readonly stops: ReadonlyArray<IconToggle>;
  readonly className?: string;
};

export const FilterPanel: FC<FilterPanelProps> = ({
  routes,
  stops,
  className = '',
}) => {
  const { t } = useTranslation();
  const headingClassName = 'text-sm font-bold';
  const dispatch = useAppDispatch();
  const { showMapEntityTypeFilterOverlay } = useAppSelector(selectMapFilter);

  return (
    <div
      className={twMerge(
        'flex items-end gap-2 bg-white p-2 shadow-md',
        className,
      )}
    >
      <i
        className="icon-favicon text-5xl text-tweaked-brand"
        role="presentation"
      />
      <MapObservationDateControl />

      <div className="flex items-center gap-4 rounded-md border border-grey p-2">
        <h6 className={headingClassName}>{t('map.showStops')}</h6>
        <ToggleRow toggles={stops} />
      </div>

      <div className="flex items-center gap-4 rounded-md border border-grey p-2">
        <h6 className={headingClassName}>{t('map.showRoutes')}</h6>
        <ToggleRow toggles={routes} />
      </div>
      <div>
        <IconButton
          tooltip={t('accessibility:map.showFilters')}
          className="block h-11 w-11 self-stretch rounded-md border border-black"
          icon={
            <MdLayers className="aria-hidden text-2xl text-tweaked-brand" />
          }
          onClick={() =>
            dispatch(
              setShowMapEntityTypeFilterOverlayAction(
                !showMapEntityTypeFilterOverlay,
              ),
            )
          }
          testId={testIds.toggleFiltersButton}
        />
      </div>
    </div>
  );
};
