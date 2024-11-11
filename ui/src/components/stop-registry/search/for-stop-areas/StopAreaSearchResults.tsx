import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { SortStopsBy, StopSearchResultsProps } from '../types';
import { StopAreaNongroupedStopsResults } from './StopAreaNongroupedStopsResults';
import { StopAreaSearchGroupedStopsResults } from './StopAreaSearchGroupedStopsResults';
import { useFindStopAreas } from './useFindStopAreas';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopAreaSearchResults',
};

export const StopAreaSearchResults: FC<StopSearchResultsProps> = ({
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
