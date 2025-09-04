import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { SearchGroupedStopsResults } from '../components/StopPlaceSharedComponents/GroupedStopsResults';
import { NongroupedStopsResults } from '../components/StopPlaceSharedComponents/NongroupedStopsResults';
import { useFindStopPlaces } from '../components/StopPlaceSharedComponents/useFindStopPlaces';
import { SortStopsBy, StopSearchResultsProps } from '../types';
import { CountAndSortingRow } from './CountAndSortingRow';
import { StopAreaHeader } from './StopAreaHeader';
import { StopAreaSearchNoStops } from './StopAreaSearchNoStops';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopAreaSearchResults',
};

export const StopAreaSearchResults: FC<StopSearchResultsProps> = ({
  filters,
  pagingInfo,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  const { t } = useTranslation();

  const { stopPlaces, loading } = useFindStopPlaces(filters, 'is_area');

  const { sortBy } = sortingInfo;
  const groupByArea =
    sortBy === SortStopsBy.BY_STOP_AREA || sortBy === SortStopsBy.DEFAULT;

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      {groupByArea ? (
        <SearchGroupedStopsResults
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
          stopPlaces={stopPlaces}
          CountAndSortingRowComponent={CountAndSortingRow}
          HeaderComponent={StopAreaHeader}
          NoStopsComponent={StopAreaSearchNoStops}
          translationLabel="stopRegistrySearch.stopAreas"
        />
      ) : (
        <NongroupedStopsResults
          stopPlaces={stopPlaces}
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          pagingInfo={pagingInfo}
          setPagingInfo={setPagingInfo}
          CountAndSortingRowComponent={CountAndSortingRow}
        />
      )}
    </LoadingWrapper>
  );
};
