import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { SortStopsBy, StopSearchResultsProps } from '../types';
import { StopsByLineNongroupedStopsResults } from './StopsByLineNongroupedStopsResults';
import { StopsByLineSearchGroupedStopsResults } from './StopsByLineSearchGroupedStopsResults';
import { useFindLinesByStopSearch } from './useFindLinesByStopSearch';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopByLinesSearchResults',
};

export const StopsByLineSearchResults: FC<StopSearchResultsProps> = ({
  filters,
  pagingInfo,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  const { t } = useTranslation();

  const { lines, loading } = useFindLinesByStopSearch(filters);

  const { sortBy } = sortingInfo;
  const groupByLine =
    sortBy === SortStopsBy.SEQUENCE_NUMBER || sortBy === SortStopsBy.DEFAULT;

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      {groupByLine ? (
        <StopsByLineSearchGroupedStopsResults
          lines={lines}
          observationDate={filters.observationDate}
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
        />
      ) : (
        <StopsByLineNongroupedStopsResults
          lines={lines}
          observationDate={filters.observationDate}
          pagingInfo={pagingInfo}
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
        />
      )}
    </LoadingWrapper>
  );
};
