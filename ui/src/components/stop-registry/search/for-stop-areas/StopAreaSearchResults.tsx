import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { PagingInfo } from '../../../../types';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { SortStopsBy, SortingInfo, StopSearchFilters } from '../types';
import { StopAreaNongroupedStopsResults } from './StopAreaNongroupedStopsResults';
import { StopAreaSearchGroupedStopsResults } from './StopAreaSearchGroupedStopsResults';
import { useFindStopAreas } from './useFindStopAreas';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopAreaSearchResults',
};

type StopAreaSearchResultsProps = {
  readonly filters: StopSearchFilters;
  readonly pagingInfo: PagingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
};

export const StopAreaSearchResults: FC<StopAreaSearchResultsProps> = ({
  filters,
  pagingInfo,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  const { t } = useTranslation();

  const { stopAreas, loading } = useFindStopAreas(filters);

  const { sortBy } = sortingInfo;
  const groupByArea =
    sortBy === SortStopsBy.BY_STOP_AREA || sortBy === SortStopsBy.DEFAULT;

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      {groupByArea ? (
        <StopAreaSearchGroupedStopsResults
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
          stopAreas={stopAreas}
        />
      ) : (
        <StopAreaNongroupedStopsResults
          stopAreas={stopAreas}
          sortingInfo={sortingInfo}
          setSortingInfo={setSortingInfo}
          pagingInfo={pagingInfo}
          setPagingInfo={setPagingInfo}
        />
      )}
    </LoadingWrapper>
  );
};
