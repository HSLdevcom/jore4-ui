import { useTranslation } from 'react-i18next';
import {
  usePagination,
  useStopSearch,
  useStopSearchResults,
} from '../../../hooks';
import { Container, Row, Visible } from '../../../layoutComponents';
import { CloseIconButton, Pagination } from '../../../uiComponents';
import { LoadingWrapper } from '../../../uiComponents/LoadingWrapper';
import { StopSearchBar } from './StopSearchBar';
import { StopSearchResultList } from './StopSearchResultList';

export const StopSearchResultPage = (): JSX.Element => {
  const { handleClose } = useStopSearch();
  const { resultCount } = useStopSearchResults();
  const { t } = useTranslation();
  const { stops, loading } = useStopSearchResults();

  const itemsPerPage = 10;
  const { getPaginatedData } = usePagination();
  const displayedStops = getPaginatedData(stops, itemsPerPage);

  const testIds = {
    container: 'StopSearchResultsPage::Container',
    closeButton: 'StopSearchResultsPage::closeButton',
    loadingSearchResults: 'LoadingWrapper::loadingStopSearchResults',
  };

  return (
    <Container testId={testIds.container}>
      <Row>
        <h2>{`${t('search.searchResultsTitle')} | ${t(
          'stopRegistrySearch.searchResultsTitle',
        )}`}</h2>
        <CloseIconButton
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={handleClose}
          testId={testIds.closeButton}
        />
      </Row>
      <StopSearchBar />
      <LoadingWrapper
        className="flex justify-center"
        loadingText={t('search.searching')}
        loading={loading}
        testId={testIds.loadingSearchResults}
      >
        {/* TODO: Search result filter input */}
        {/* TODO: Selection toolbar */}
        <StopSearchResultList stops={displayedStops} />
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
    </Container>
  );
};
