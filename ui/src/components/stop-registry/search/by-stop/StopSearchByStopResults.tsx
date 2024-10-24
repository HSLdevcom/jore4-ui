import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { usePagination } from '../../../../hooks';
import { Visible } from '../../../../layoutComponents';
import { Pagination } from '../../../../uiComponents';
import { LoadingWrapper } from '../../../../uiComponents/LoadingWrapper';
import { sortAlphabetically } from '../../../../utils';
import { StopSearchByStopResultList } from './StopSearchByStopResultList';
import { useStopSearchResults } from './useStopSearchResults';

const itemsPerPage = 10;

const testIds = {
  loadingSearchResults: 'LoadingWrapper::loadingStopSearchResults',
};

export const StopSearchByStopResults: FC = () => {
  const { t } = useTranslation();

  const { stops, loading, resultCount } = useStopSearchResults();

  const { getPaginatedData } = usePagination();
  const sortedStopsByLabel = sortAlphabetically(stops, 'label');
  const displayedStops = getPaginatedData(sortedStopsByLabel, itemsPerPage);

  return (
    <LoadingWrapper
      className="flex justify-center"
      loadingText={t('search.searching')}
      loading={loading}
      testId={testIds.loadingSearchResults}
    >
      {/* TODO: Search result filter input */}
      {/* TODO: Selection toolbar */}
      <StopSearchByStopResultList stops={displayedStops} />
      <Visible visible={!!resultCount}>
        <div className="grid grid-cols-4">
          <Pagination
            className="col-span-2 col-start-2 pt-4"
            itemsPerPage={itemsPerPage}
            totalItemsCount={resultCount}
          />
        </div>
      </Visible>
    </LoadingWrapper>
  );
};
