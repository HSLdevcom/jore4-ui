import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../layoutComponents';
import { Pagination } from '../../../../uiComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import {
  LoadingStopsErrorRow,
  SelectableStopSearchResultStopsTable,
} from '../components';
import { useGroupedResultSelection, useStopSearchRouterState } from '../utils';
import { StopsByLineCountAndSortingRow } from './StopsByLineCountAndSortingRow';
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
    state: { filters, pagingInfo, sortingInfo },
    setPagingInfo,
    setSortingInfo,
    historyState: { resultSelection },
  } = useStopSearchRouterState();

  const {
    stops,
    resultCount,
    quayIds,
    loading,
    error,
    resolveStopPlaceIdsInError,
    resolveStopPlaceIdsRefetch,
    stopsInError,
    stopsRefetch,
  } = useGetStopSearchByLinesResult(lines, pagingInfo, sortingInfo);

  const { onToggleSelectAll, onToggleSelection } = useGroupedResultSelection();

  const { observationDate } = filters;

  const filtersWithQuayIds = {
    ...filters,
    quayIds: quayIds.slice(),
  };

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      <StopsByLineCountAndSortingRow
        filters={filtersWithQuayIds}
        className="mb-6"
        resultCount={resultCount}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
        allSelected={resultSelection.selectionState === 'ALL_SELECTED'}
        onToggleSelectAll={onToggleSelectAll}
        hasResults={resultCount > 0}
        resultSelection={resultSelection}
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
        <SelectableStopSearchResultStopsTable
          observationDate={observationDate}
          stops={stops}
          onToggleSelection={onToggleSelection}
          selection={resultSelection}
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
