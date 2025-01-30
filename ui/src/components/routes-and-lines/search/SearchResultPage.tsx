import { useTranslation } from 'react-i18next';
import { useSearch, useSearchResults } from '../../../hooks';
import { useBasePath } from '../../../hooks/useBasePath';
import { Container, Row, Visible } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import {
  CloseIconButton,
  CompatPagination,
  usePagination,
} from '../../../uiComponents';
import { LoadingWrapper } from '../../../uiComponents/LoadingWrapper';
import { PageTitle } from '../../common';
import { RouteLineTableRowVariant } from '../../common/RouteLineTableRow';
import { ResultList } from '../../common/search/ResultList';
import { ExportToolbar } from './ExportToolbar';
import { FiltersContainer } from './filters/FiltersContainer';
import { SearchContainer } from './SearchContainer';

export const SearchResultPage = (): React.ReactElement => {
  const { handleClose, queryParameters } = useSearch();
  const { resultCount } = useSearchResults();
  const { t } = useTranslation();
  const { getPaginatedData } = usePagination();
  const { lines, reducedRoutes, loading } = useSearchResults();
  const { basePath } = useBasePath();
  const itemsPerPage = 10;

  const displayedLines = getPaginatedData(lines, itemsPerPage);
  const displayedRoutes = getPaginatedData(reducedRoutes, itemsPerPage);

  const testIds = {
    container: 'SearchResultsPage::Container',
    closeButton: 'SearchResultsPage::closeButton',
    loadingSearchResults: 'LoadingWrapper::loadingSearchResults',
  };

  const determineDisplayInformation = () => {
    switch (basePath) {
      case Path.timetables:
        return {
          title: t('timetables.timetables'),
          rowVariant: RouteLineTableRowVariant.Timetables,
        };
      case Path.routes:
      default:
        return {
          title: t('routes.routes'),
          rowVariant: RouteLineTableRowVariant.RoutesAndLines,
        };
    }
  };

  const displayInformation = determineDisplayInformation();

  return (
    <Container testId={testIds.container}>
      <Row>
        <PageTitle.H1>
          {`${t('search.searchResultsTitle')} | ${displayInformation.title}`}
        </PageTitle.H1>
        <CloseIconButton
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={handleClose}
          testId={testIds.closeButton}
        />
      </Row>
      <SearchContainer />
      <LoadingWrapper
        className="flex justify-center"
        loadingText={t('search.searching')}
        loading={loading}
        testId={testIds.loadingSearchResults}
      >
        <FiltersContainer />
        <ExportToolbar />
        <ResultList
          lines={displayedLines}
          routes={displayedRoutes}
          rowVariant={displayInformation.rowVariant}
          displayedType={queryParameters.filter.displayedType}
        />
        <Visible visible={!!resultCount}>
          <div className="grid grid-cols-4">
            <CompatPagination
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
