import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { SearchGroupedStopsResults } from '../components/shared/GroupedStopsResults';
import { NongroupedStopsResults } from '../components/shared/NongroupedStopsResults';
import { useFindStopPlaces } from '../components/shared/useFindStopPlaces';
import { SortStopsBy, StopSearchResultsProps } from '../types';

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
          isTerminal={false}
        />
      ) : (
        <NongroupedStopsResults
          stopPlaces={stopPlaces}
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          pagingInfo={pagingInfo}
          setPagingInfo={setPagingInfo}
          isTerminal={false}
        />
      )}
    </LoadingWrapper>
  );
};
