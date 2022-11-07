import { useTranslation } from 'react-i18next';
import { useSearch, useSearchResults } from '../../../hooks';
import { usePagination } from '../../../hooks/usePagination';
import { Container, Row, Visible } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import { CloseIconButton, Pagination } from '../../../uiComponents';
import { ResultList } from '../../common/search/ResultList';
import { ExportToolbar } from './ExportToolbar';
import { FiltersContainer } from './filters/FiltersContainer';
import { SearchContainer } from './SearchContainer';

export const SearchResultPage = (): JSX.Element => {
  const { handleClose, queryParameters } = useSearch({
    basePath: Path.routes,
  });
  const { resultCount } = useSearchResults();
  const { t } = useTranslation();
  const { getPaginatedData } = usePagination();
  const { lines, routes } = useSearchResults();
  const itemsPerPage = 10;

  const displayedLines = getPaginatedData(lines, itemsPerPage);
  const displayedRoutes = getPaginatedData(routes, itemsPerPage);

  const testIds = {
    container: 'SearchResultsPage::Container',
  };

  return (
    <Container testId={testIds.container}>
      <Row>
        <h2>{`${t('search.searchResultsTitle')} | ${t('routes.routes')}`}</h2>
        <CloseIconButton
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={handleClose}
        />
      </Row>
      <SearchContainer />
      <FiltersContainer />
      <ExportToolbar />
      <ResultList
        lines={displayedLines}
        routes={displayedRoutes}
        basePath={Path.lineDetails}
        displayedData={queryParameters.filter.displayedData}
      />
      <Visible visible={!!resultCount}>
        <div className="grid grid-cols-4">
          <Pagination
            className="col-span-2 col-start-2 pt-4"
            itemsPerPage={itemsPerPage}
            totalItemsCount={resultCount}
          />
        </div>
      </Visible>
    </Container>
  );
};
