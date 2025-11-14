import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../layoutComponents';
import { Pagination } from '../../../../uiComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import {
  LoadingStopsErrorRow,
  StopSearchResultStopsTable,
} from '../components';
import { useStopSearchRouterState } from '../utils';
import { CountAndSortingRow } from './CountAndSortingRow';
import { FindStopByLineInfo } from './useFindLinesByStopSearch';
import { useGetStopSearchByLinesResult } from './useGetStopSearchByLinesResult';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopSearchResults',
};

type StopsByLineNongroupedStopsResultsProps = {
  readonly lines: ReadonlyArray<FindStopByLineInfo>;
};

export const StopsByLineNongroupedStopsResults: FC<
  StopsByLineNongroupedStopsResultsProps
> = ({ lines }) => {
  const { t } = useTranslation();

  const {
    state: {
      filters: { observationDate },
      pagingInfo,
      sortingInfo,
    },
    setPagingInfo,
    setSortingInfo,
  } = useStopSearchRouterState();

  const {
    stops,
    resultCount,
    loading,
    error,
    resolveStopPlaceIdsInError,
    resolveStopPlaceIdsRefetch,
    stopsInError,
    stopsRefetch,
  } = useGetStopSearchByLinesResult(lines, pagingInfo, sortingInfo);

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
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
      />

      {error && resolveStopPlaceIdsInError && (
        <LoadingStopsErrorRow
          error={error}
          refetch={resolveStopPlaceIdsRefetch}
        />
      )}

      {error && stopsInError && (
        <LoadingStopsErrorRow error={error} refetch={stopsRefetch} />
      )}

      {!error && (
        <StopSearchResultStopsTable
          observationDate={observationDate}
          stops={stops}
        />
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
