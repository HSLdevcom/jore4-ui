import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../layoutComponents';
import { PagingInfo } from '../../../../types';
import { Pagination } from '../../../../uiComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { StopSearchFilters, StopSearchRow } from '../types';
import { StopSearchByStopResultList } from './StopSearchByStopResultList';
import { useStopSearchResults } from './useStopSearchResults';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopSearchResults',
};

// TODO: Replace with proper backend pagination once backend sorting is also in place.
function useSortedAndPaginatedStops(
  stops: ReadonlyArray<StopSearchRow>,
  { page, pageSize }: PagingInfo,
): ReadonlyArray<StopSearchRow> {
  const sorted = useMemo(
    () => stops.toSorted((a, b) => a.label.localeCompare(b.label)),
    [stops],
  );

  return useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sorted.slice(startIndex, endIndex);
  }, [page, pageSize, sorted]);
}

type StopSearchByStopResultsProps = {
  readonly filters: StopSearchFilters;
  readonly pagingInfo: PagingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
};

export const StopSearchByStopResults: FC<StopSearchByStopResultsProps> = ({
  filters,
  pagingInfo,
  setPagingInfo,
}) => {
  const { t } = useTranslation();

  const { stops, loading, resultCount } = useStopSearchResults(filters);

  const displayedStops = useSortedAndPaginatedStops(stops, pagingInfo);

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      {/* TODO: Search result filter input */}
      {/* TODO: Selection toolbar */}
      <StopSearchByStopResultList stops={displayedStops} />
      <Visible visible={!!resultCount}>
        <div className="grid grid-cols-4">
          <Pagination
            className="col-span-2 col-start-2 pt-4"
            pagingInfo={pagingInfo}
            setPagingInfo={setPagingInfo}
            totalItemsCount={resultCount}
          />
        </div>
      </Visible>
    </LoadingWrapper>
  );
};
