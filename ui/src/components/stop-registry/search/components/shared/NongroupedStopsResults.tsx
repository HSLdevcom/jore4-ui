import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Visible } from '../../../../../layoutComponents';
import { PagingInfo } from '../../../../../types';
import { Pagination } from '../../../../../uiComponents';
import { LoadingWrapper } from '../../../../../uiComponents/LoadingWrapper';
import { CountAndSortingRow } from '../../for-stop-areas/CountAndSortingRow';
import { TerminalCountAndSortingRow } from '../../for-terminals/TerminalCountAndSortingRow';
import { SortingInfo } from '../../types';
import { LoadingStopsErrorRow } from '../LoadingStopsErrorRow';
import { StopSearchResultStopsTable } from '../StopSearchResultStopsTable';
import { FindStopPlaceInfo } from './useFindStopPlaces';
import { useStopSearchByStopPlacesResults } from './useStopSearchByStopPlacesResults';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopSearchResults',
};

type NongroupedStopsResults = {
  readonly pagingInfo: PagingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
  readonly stopPlaces: ReadonlyArray<FindStopPlaceInfo>;
  readonly isTerminal: boolean;
};

export const NongroupedStopsResults: FC<NongroupedStopsResults> = ({
  pagingInfo,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
  stopPlaces,
  isTerminal,
}) => {
  const { t } = useTranslation();

  const { stops, loading, resultCount, error, refetch } =
    useStopSearchByStopPlacesResults(stopPlaces, sortingInfo, pagingInfo);

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      {isTerminal ? (
        <TerminalCountAndSortingRow
          className="mb-6"
          resultCount={resultCount}
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
        />
      ) : (
        <CountAndSortingRow
          className="mb-6"
          resultCount={resultCount}
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
        />
      )}

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
