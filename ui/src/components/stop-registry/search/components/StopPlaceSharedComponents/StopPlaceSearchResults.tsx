import { ComponentType, FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationKey } from '../../../../../i18n';
import { LoadingWrapper } from '../../../../../uiComponents/LoadingWrapper';
import { SortStopsBy } from '../../types';
import { useStopSearchRouterState } from '../../utils';
import { SearchGroupedStopsResults } from './GroupedStopsResults';
import { NongroupedStopsResults } from './NongroupedStopsResults';
import { StopPlaceHeaderPublicPropsProps } from './StopPlaceHeader';
import { NoStopsComponentProps } from './types';
import { useFindStopPlaces } from './useFindStopPlaces';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopPlaceSearchResults',
};

type StopPlaceSearchResultsProps = {
  readonly groupingField: SortStopsBy;
  readonly placeType: 'area' | 'terminal';
  readonly translationLabel: TranslationKey;
  readonly HeaderComponent: ComponentType<StopPlaceHeaderPublicPropsProps>;
  readonly NoStopsComponent: ComponentType<NoStopsComponentProps>;
};

export const StopPlaceSearchResults: FC<StopPlaceSearchResultsProps> = ({
  groupingField,
  placeType,
  translationLabel,
  HeaderComponent,
  NoStopsComponent,
}) => {
  const { t } = useTranslation();

  const {
    state: {
      filters,
      sortingInfo: { sortBy },
    },
    historyState,
    setHistoryState,
  } = useStopSearchRouterState();

  const { stopPlaces, loading } = useFindStopPlaces(filters, placeType);

  const groupByArea =
    sortBy === groupingField || sortBy === SortStopsBy.DEFAULT;

  // When switching back to grouped view, knownStopIds may still be in 'flat'
  // mode. Reset it to 'grouped'.
  useEffect(() => {
    if (!groupByArea) {
      return;
    }
    setHistoryState((p) => {
      if (p.knownStopIds.listingMode === 'grouped') {
        return p;
      }
      return {
        ...p,
        knownStopIds: { listingMode: 'grouped', ids: [], groups: {} },
      };
    });
  }, [groupByArea, setHistoryState]);

  const isReadyToShowGrouped =
    groupByArea && historyState.knownStopIds.listingMode === 'grouped';

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={stopPlaces.length === 0 ? loading : false}
      testId={testIds.loadingSearchResults}
    >
      {isReadyToShowGrouped ? (
        <SearchGroupedStopsResults
          groupingField={groupingField}
          stopPlaces={stopPlaces}
          HeaderComponent={HeaderComponent}
          NoStopsComponent={NoStopsComponent}
          translationLabel={translationLabel}
        />
      ) : (
        <NongroupedStopsResults stopPlaces={stopPlaces} />
      )}
    </LoadingWrapper>
  );
};
