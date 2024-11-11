import React, { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../layoutComponents';
import { PagingInfo } from '../../../../types';
import { Pagination } from '../../../../uiComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import {
  LoadingStopsErrorRow,
  StopSearchResultStopsTable,
} from '../components';
import { SortingInfo } from '../types';
import { CountAndSortingRow } from './CountAndSortingRow';
import { FindStopAreaInfo } from './useFindStopAreas';
import { useStopSearchByStopAreasResults } from './useStopSearchByStopAreasResults';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopSearchResults',
};

type StopAreaNongroupedStopsResults = {
  readonly pagingInfo: PagingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
  readonly stopAreas: ReadonlyArray<FindStopAreaInfo>;
};

export const StopAreaNongroupedStopsResults: FC<
  StopAreaNongroupedStopsResults
> = ({ pagingInfo, setPagingInfo, setSortingInfo, sortingInfo, stopAreas }) => {
  const { t } = useTranslation();

  const { stops, loading, resultCount, error, refetch } =
    useStopSearchByStopAreasResults(stopAreas, sortingInfo, pagingInfo);

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
