import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { SearchGroupedStopsResults } from '../components/StopPlaceSharedComponents/GroupedStopsResults';
import { NongroupedStopsResults } from '../components/StopPlaceSharedComponents/NongroupedStopsResults';
import { useFindStopPlaces } from '../components/StopPlaceSharedComponents/useFindStopPlaces';
import { SortStopsBy, StopSearchResultsProps } from '../types';
import { TerminalCountAndSortingRow } from './TerminalCountAndSortingRow';
import { TerminalHeader } from './TerminalHeader';
import { TerminalSearchNoStops } from './TerminalSearchNoStops';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingTerminalSearchResults',
};

export const TerminalSearchResults: FC<StopSearchResultsProps> = ({
  filters,
  pagingInfo,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  const { t } = useTranslation();

  const { stopPlaces, loading } = useFindStopPlaces(filters, 'terminal');

  const { sortBy } = sortingInfo;
  const groupByTerminal =
    sortBy === SortStopsBy.BY_TERMINAL || sortBy === SortStopsBy.DEFAULT;

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      {groupByTerminal ? (
        <SearchGroupedStopsResults
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
          stopPlaces={stopPlaces}
          CountAndSortingRowComponent={TerminalCountAndSortingRow}
          HeaderComponent={TerminalHeader}
          NoStopsComponent={TerminalSearchNoStops}
          translationLabel="stopRegistrySearch.terminals"
        />
      ) : (
        <NongroupedStopsResults
          stopPlaces={stopPlaces}
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          pagingInfo={pagingInfo}
          setPagingInfo={setPagingInfo}
          CountAndSortingRowComponent={TerminalCountAndSortingRow}
        />
      )}
    </LoadingWrapper>
  );
};
