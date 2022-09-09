import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch, useSearchResults } from '../../../hooks';
import { usePagination } from '../../../hooks/usePagination';
import { Container, Row, Visible } from '../../../layoutComponents';
import { CloseIconButton, Pagination } from '../../../uiComponents';
import { SearchContainer } from './conditions/SearchContainer';
import { FiltersContainer } from './filters/FiltersContainer';
import { ResultList } from './ResultList';

export const SearchResultPage = (): JSX.Element => {
  const { handleClose } = useSearch();
  const { resultCount } = useSearchResults();
  const { t } = useTranslation();
  const { getPaginatedData } = usePagination();
  const { lines, routes } = useSearchResults();
  const itemsPerPage = 10;

  const displayedLines = getPaginatedData(lines, itemsPerPage);
  const displayedRoutes = getPaginatedData(routes, itemsPerPage);
  const { queryParameters } = useSearch();

  const testIds = {
    container: 'SearchResultsPage::Container',
  };

  return (
    <Container testId={testIds.container}>
      <Row>
        <h1 className="text-2xl font-bold">
          {`${t('search.searchResultsTitle')} | ${t('routes.routes')}`}
        </h1>
        <CloseIconButton
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={handleClose}
        />
      </Row>
      <SearchContainer />
      <FiltersContainer />
      <h1 className="my-4 text-2xl font-bold">
        {t('search.resultCount', {
          resultCount,
        })}
      </h1>
      <ResultList
        lines={displayedLines}
        routes={displayedRoutes}
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
