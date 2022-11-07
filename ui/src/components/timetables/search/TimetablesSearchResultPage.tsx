import { useTranslation } from 'react-i18next';
import { useSearch } from '../../../hooks';
import { useTimetablesSearchResults } from '../../../hooks/search/useTimetablesSearchResults';
import { usePagination } from '../../../hooks/usePagination';
import { Container, Row, Visible } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import { CloseIconButton, Pagination } from '../../../uiComponents';
import { ResultList } from '../../common/search/ResultList';
import { ResultSelector } from '../../common/search/ResultSelector';
import { TimetablesSearchContainer } from './TimetablesSearchContainer';

export const TimetablesSearchResultPage = (): JSX.Element => {
  const { handleClose, queryParameters } = useSearch({
    basePath: Path.timetables,
  });
  const { routes, lines, resultCount } = useTimetablesSearchResults();
  const { t } = useTranslation();
  const { getPaginatedData } = usePagination();
  const itemsPerPage = 10;

  // const displayedLines = getPaginatedData(lines, itemsPerPage);
  const displayedRoutes = getPaginatedData(routes, itemsPerPage);

  const testIds = {
    container: 'SearchResultsPage::Container',
  };

  return (
    <Container testId={testIds.container}>
      <Row>
        <h2>{`${t('search.searchResultsTitle')} | ${t(
          'timetables.timetables',
        )}`}</h2>
        <CloseIconButton
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={handleClose}
        />
      </Row>
      <TimetablesSearchContainer />
      <Row className="my-4">
        <ResultSelector basePath={Path.timetables} />
      </Row>
      <ResultList
        routes={displayedRoutes}
        lines={lines}
        basePath={Path.lineTimetables}
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
