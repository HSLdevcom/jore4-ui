import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../layoutComponents';
import { PagingInfo } from '../../../../types';
import { Pagination } from '../../../../uiComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { SortingInfo, StopSearchFilters } from '../types';
import { CountAndSortingRow } from './CountAndSortingRow';
import { StopSearchByStopResultList } from './StopSearchByStopResultList';
import { useStopSearchResults } from './useStopSearchResults';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopSearchResults',
};

type StopSearchByStopResultsProps = {
  readonly filters: StopSearchFilters;
  readonly pagingInfo: PagingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
};

export const StopSearchByStopResults: FC<StopSearchByStopResultsProps> = ({
  filters,
  pagingInfo,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  const { t } = useTranslation();

  const { stops, loading, resultCount } = useStopSearchResults(
    filters,
    sortingInfo,
    pagingInfo,
  );

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      <CountAndSortingRow
        className="mb-6"
        resultCount={resultCount}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
      />
      <StopSearchByStopResultList stops={stops} />
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
