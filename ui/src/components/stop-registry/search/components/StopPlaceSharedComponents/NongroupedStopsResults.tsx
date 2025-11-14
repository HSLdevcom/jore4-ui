import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../../layoutComponents';
import { Pagination } from '../../../../../uiComponents';
import { LoadingWrapper } from '../../../../../uiComponents/LoadingWrapper';
import { SortStopsBy } from '../../types';
import { useResultSelection, useStopSearchRouterState } from '../../utils';
import { LoadingStopsErrorRow } from '../LoadingStopsErrorRow';
import { SelectableStopSearchResultStopsTable } from '../StopSearchResultStopsTable';
import { NonGroupedCountAndSortingRow } from './StopPlaceCountAndSortingRow';
import { FindStopPlaceInfo } from './useFindStopPlaces';
import { useStopSearchByStopPlacesResults } from './useStopSearchByStopPlacesResults';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopSearchResults',
};

type NongroupedStopsResults = {
  readonly stopPlaces: ReadonlyArray<FindStopPlaceInfo>;
};

export const NongroupedStopsResults: FC<NongroupedStopsResults> = ({
  stopPlaces,
}) => {
  const { t } = useTranslation();

  const {
    state: {
      filters: { observationDate },
      pagingInfo,
      sortingInfo,
    },
    historyState: { resultSelection },
    setPagingInfo,
    setHistoryState,
  } = useStopSearchRouterState();

  const stopPlaceIds = useMemo(
    () => stopPlaces.map((it) => it.id),
    [stopPlaces],
  );

  const { stops, loading, resultCount, error, refetch } =
    useStopSearchByStopPlacesResults(stopPlaceIds, sortingInfo, pagingInfo);

  const stopIds = useMemo(() => stops.map((it) => it.id), [stops]);

  const { onToggleSelection, onToggleSelectAll } = useResultSelection({
    resultCount,
    stopIds,
    setHistoryState,
  });

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      <NonGroupedCountAndSortingRow
        allSelected={resultSelection.selectionState === 'ALL_SELECTED'}
        className="mb-6"
        groupingField={SortStopsBy.BY_STOP_AREA}
        onToggleSelectAll={onToggleSelectAll}
        hasResults={stops.length > 0}
        resultCount={resultCount}
        resultSelection={resultSelection}
        stopPlaceIds={stopPlaceIds}
      />

      {error ? (
        <LoadingStopsErrorRow error={error} refetch={refetch} />
      ) : (
        <SelectableStopSearchResultStopsTable
          observationDate={observationDate}
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
