import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../layoutComponents';
import { Pagination } from '../../../../uiComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import {
  LoadingStopsErrorRow,
  SelectableStopSearchResultStopsTable,
} from '../components';
import { ExtendedStopSearchResultsProps } from '../types';
import { useResultSelection } from '../utils';
import { CountAndSortingRow } from './CountAndSortingRow';
import { useStopSearchByStopResults } from './useStopSearchByStopResults';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopSearchResults',
};

export const StopSearchByStopResults: FC<ExtendedStopSearchResultsProps> = ({
  filters,
  historyState: { resultSelection },
  pagingInfo,
  setHistoryState,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  const { t } = useTranslation();

  const { stops, loading, resultCount, error, refetch } =
    useStopSearchByStopResults(filters, sortingInfo, pagingInfo);

  const { onToggleSelection, onToggleSelectAll } = useResultSelection({
    resultCount,
    stops,
    setHistoryState,
  });

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={resultCount === 0 ? loading : false}
      testId={testIds.loadingSearchResults}
    >
      <CountAndSortingRow
        allSelected={resultSelection.selectionState === 'ALL_SELECTED'}
        className="mb-6"
        filters={filters}
        onToggleSelectAll={onToggleSelectAll}
        resultCount={resultCount}
        resultSelection={resultSelection}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
        stops={stops}
      />
      {error ? (
        <LoadingStopsErrorRow error={error} refetch={refetch} />
      ) : (
        <SelectableStopSearchResultStopsTable
          observationDate={filters.observationDate}
          onToggleSelection={onToggleSelection}
          selection={resultSelection}
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
