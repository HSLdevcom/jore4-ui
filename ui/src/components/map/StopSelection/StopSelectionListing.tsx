import noop from 'lodash/noop';
import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PulseLoader from 'react-spinners/PulseLoader';
import { twMerge } from 'tailwind-merge';
import { StopSelectionInfoFragment as StopSelectionInfo } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { useAppAction, useAppSelector } from '../../../hooks';
import {
  FilterType,
  selectMapFilter,
  toggleStopSelectionAction,
} from '../../../redux';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { useMapObservationDate } from '../utils/mapUrlState';
import { SelectedStop } from './SelectedStop';
import { useSelectedStopsInfo } from './useSelectedStopsInfo';

const maxStopsToShowByDefault = 100;

const testIds = {
  resolvingSearchResults: 'Map::StopSelection::resolvingSearchResults',
  resolvingSearchResultsFailed:
    'Map::StopSelection::resolvingSearchResultsFailed',
  nothingSelected: 'Map::StopSelection::nothingSelected',
  listing: 'Map::StopSelection::listing',
  loadingMissingDetails: 'Map::StopSelection::loadingMissingDetails',
  loadingMissingDetailsFailed:
    'Map::StopSelection::loadingMissingDetailsFailed',
  retryButton: 'Map::StopSelection::retryButton',
  showAllButton: 'Map::StopSelection::showAllButton',
};

function useGetLinkToDetailsPage(): (stop: StopSelectionInfo) => string {
  const { stopFilters } = useAppSelector(selectMapFilter);

  const observationDate = useMapObservationDate();

  const showHighestPriorityCurrentStops =
    stopFilters[FilterType.ShowHighestPriorityCurrentStops];

  return useCallback(
    (stop) => {
      const { public_code: publicCode, priority } = stop;

      // AKA default map mode. → Standard/Temp prio, on selected day.
      if (showHighestPriorityCurrentStops) {
        return routeDetails[Path.stopDetails].getLink(publicCode, {
          observationDate,
        });
      }

      return routeDetails[Path.stopDetails].getLink(publicCode, {
        observationDate,
        priority: priority ?? '',
      });
    },
    [observationDate, showHighestPriorityCurrentStops],
  );
}

type StopSelectionListingProps = { readonly className?: string };

export const StopSelectionListing: FC<StopSelectionListingProps> = ({
  className,
}) => {
  const { t } = useTranslation();

  const [showAll, setShowAll] = useState<boolean>(false);

  const {
    selectionIsKnown,
    allAreKnown,
    stops,
    resolveError,
    resolveRefetch,
    loadError,
    loadRefetch,
  } = useSelectedStopsInfo();

  const stopsToShow =
    showAll || stops.length < maxStopsToShowByDefault
      ? stops
      : stops.slice(0, maxStopsToShowByDefault);

  const toggleStopSelection = useAppAction(toggleStopSelectionAction);

  const getLinkToDetailsPage = useGetLinkToDetailsPage();

  const rootContainerClassNames = twMerge(
    'flex flex-col items-center justify-center gap-2 p-2',
    className,
  );

  if (!selectionIsKnown) {
    return (
      <div
        className={rootContainerClassNames}
        data-testid={testIds.resolvingSearchResults}
      >
        <p>{t('map.stopSelection.resolvingSearchResultSelection')}</p>
        <PulseLoader color={theme.colors.brand} size={14} />
      </div>
    );
  }

  if (resolveError) {
    return (
      <div
        className={rootContainerClassNames}
        data-testid={testIds.resolvingSearchResultsFailed}
      >
        <p>{t('map.stopSelection.resolvingSearchResultSelectionFailed')}</p>
        <SimpleButton
          className="py-1"
          onClick={() => resolveRefetch().then(noop, noop)}
          testId={testIds.retryButton}
        >
          {t('map.stopSelection.retry')}
        </SimpleButton>
      </div>
    );
  }

  if (stopsToShow.length === 0) {
    return (
      <div
        className={rootContainerClassNames}
        data-testid={testIds.nothingSelected}
      >
        <p>{t('map.stopSelection.nothingSelected')}</p>
      </div>
    );
  }

  const removeButtonTitle = t('map.stopSelection.removeSelection');

  return (
    <div
      className={twMerge('max-h-[min(50vh,500px)] overflow-y-auto', className)}
      data-testid={testIds.listing}
    >
      {!allAreKnown && !loadError ? (
        <div
          className="flex flex-col items-center justify-center gap-2 border-b border-light-grey p-2"
          data-testid={testIds.loadingMissingDetails}
        >
          <p>{t('map.stopSelection.loadingMissingDetails')}</p>
          <PulseLoader color={theme.colors.brand} size={14} />
        </div>
      ) : null}

      {!allAreKnown && loadError ? (
        <div
          className="flex flex-col items-center justify-center gap-2 border-b border-light-grey p-2"
          data-testid={testIds.loadingMissingDetailsFailed}
        >
          <p>{t('map.stopSelection.loadingMissingDetailsFailed')}</p>
          <SimpleButton
            className="py-1"
            onClick={() => loadRefetch().then(noop, noop)}
            testId={testIds.retryButton}
          >
            {t('map.stopSelection.retry')}
          </SimpleButton>
        </div>
      ) : null}

      {stopsToShow.map((stop) => (
        <SelectedStop
          key={stop.netex_id}
          linkToDetailsPage={getLinkToDetailsPage(stop)}
          onRemoveFromSelection={() => toggleStopSelection(stop.netex_id ?? '')}
          stop={stop}
          // Avoid calling functions (useTranslate and t-function) in a loop.
          removeButtonTitle={removeButtonTitle}
        />
      ))}

      {stops !== stopsToShow && (
        <SimpleButton
          className="mx-auto my-2 py-1"
          inverted
          onClick={() => setShowAll(true)}
          testId={testIds.showAllButton}
        >
          {t('map.stopSelection.showAll', { count: stops.length })}
        </SimpleButton>
      )}
    </div>
  );
};
