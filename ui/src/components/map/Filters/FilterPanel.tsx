import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLayers } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import {
  selectMapFilter,
  setShowMapEntityTypeFilterOverlayAction,
  useAppDispatch,
  useAppSelector,
} from '../../../redux';
import { IconButton } from '../../common/Buttons';
import { StopSelection } from '../StopSelection';
import { useIsInSearchResultMode } from '../Utils/useIsInSearchResultMode';
import { MapObservationDateControl } from './MapObservationDateControl';
import { ToggleRow } from './ToggleRow';
import { IconToggleProps } from './types';

const testIds = {
  toggleFiltersButton: 'ObservationDateOverlay::toggleFiltersButton',
};

// Legend has bottom margin by default so it needs to be removed with mb-0
const headingClassName = 'text-sm font-bold float-left mb-0';

type FilterPanelProps = {
  readonly routes: ReadonlyArray<IconToggleProps>;
  readonly stops: ReadonlyArray<IconToggleProps>;
  readonly className?: string;
};

export const FilterPanel: FC<FilterPanelProps> = ({
  routes,
  stops,
  className,
}) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const { showMapEntityTypeFilterOverlay } = useAppSelector(selectMapFilter);
  const isInSearchResultMode = useIsInSearchResultMode();

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
      {!isInSearchResultMode && (
        <>
          <MapObservationDateControl />

          <fieldset className="flex items-center gap-4 rounded-md border border-grey p-2">
            <legend className={headingClassName}>
              {t(($) => $.map.showStops)}
            </legend>
            <ToggleRow toggles={stops} />
          </fieldset>

          <fieldset className="flex items-center gap-4 rounded-md border border-grey p-2">
            <legend className={headingClassName}>
              {t(($) => $.map.showRoutes)}
            </legend>
            <ToggleRow toggles={routes} />
          </fieldset>

          <IconButton
            tooltip={t(($) => $.accessibility.map.showFilters)}
            className="block h-11 w-11 rounded-md border border-black"
            icon={
              <MdLayers aria-hidden className="text-2xl text-tweaked-brand" />
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
        </>
      )}
      <StopSelection
        align={isInSearchResultMode ? 'left' : 'right'}
        className="h-11 w-11 rounded-md border border-black"
      />
    </div>
  );
};
