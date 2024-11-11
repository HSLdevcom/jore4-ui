import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { PagingInfo } from '../../../../types';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { SortStopsBy, SortingInfo, StopSearchFilters } from '../types';
import { StopsByLineNongroupedStopsResults } from './StopsByLineNongroupedStopsResults';
import { StopsByLineSearchGroupedStopsResults } from './StopsByLineSearchGroupedStopsResults';
import { useFindLinesByStopSearch } from './useFindLinesByStopSearch';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopByLinesSearchResults',
};

type StopsByLineSearchResultsProps = {
  readonly filters: StopSearchFilters;
  readonly pagingInfo: PagingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
};

export const StopsByLineSearchResults: FC<StopsByLineSearchResultsProps> = ({
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
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
        />
      ) : (
        <StopsByLineNongroupedStopsResults
          lines={lines}
          pagingInfo={pagingInfo}
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
        />
      )}
    </LoadingWrapper>
  );
};
