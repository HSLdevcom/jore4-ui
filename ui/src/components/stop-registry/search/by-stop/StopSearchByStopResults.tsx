import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../layoutComponents';
import { Pagination } from '../../../../uiComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import {
  LoadingStopsErrorRow,
  StopSearchResultStopsTable,
} from '../components';
import { StopSearchResultsProps } from '../types';
import { CountAndSortingRow } from './CountAndSortingRow';
import { useStopSearchByStopResults } from './useStopSearchByStopResults';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopSearchResults',
};

export const StopSearchByStopResults: FC<StopSearchResultsProps> = ({
  filters,
  pagingInfo,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  const { t } = useTranslation();

  const { stops, loading, resultCount, error, refetch } =
    useStopSearchByStopResults(filters, sortingInfo, pagingInfo);

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
      {error ? (
        <LoadingStopsErrorRow error={error} refetch={refetch} />
      ) : (
        <StopSearchResultStopsTable stops={stops} />
      )}

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
