import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { SortStopsBy } from '../types';
import { useStopSearchRouterState } from '../utils';
import { StopsByLineNongroupedStopsResults } from './StopsByLineNongroupedStopsResults';
import { StopsByLineSearchGroupedStopsResults } from './StopsByLineSearchGroupedStopsResults';
import { useFindLinesByStopSearch } from './useFindLinesByStopSearch';

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopByLinesSearchResults',
};

export const StopsByLineSearchResults: FC = () => {
  const { t } = useTranslation();

  const {
    state: {
      filters,
      sortingInfo: { sortBy },
    },
  } = useStopSearchRouterState();
  const { lines, loading } = useFindLinesByStopSearch(filters);

  const groupByLine =
    sortBy === SortStopsBy.SEQUENCE_NUMBER || sortBy === SortStopsBy.DEFAULT;

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={lines.length === 0 ? loading : false}
      testId={testIds.loadingSearchResults}
    >
      {groupByLine ? (
        <StopsByLineSearchGroupedStopsResults lines={lines} />
      ) : (
        <StopsByLineNongroupedStopsResults lines={lines} />
      )}
    </LoadingWrapper>
  );
};
