import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch, useSearchResults } from '../../../hooks/search';
import { Container, Row } from '../../../layoutComponents';
import { CloseButton } from '../../../uiComponents';
import { LinesList } from '../LinesList'; // eslint-disable-line import/no-cycle
import { RoutesList } from '../RoutesList'; // eslint-disable-line import/no-cycle
import { SearchContainer } from './conditions/SearchContainer';
import { FiltersContainer } from './filters/FiltersContainer';
import { ResultsListHeader } from './ResultsListHeader';

export const SearchResultPage = (): JSX.Element => {
  const { queryParameters, handleClose } = useSearch();
  const { lines, routes, resultsCount } = useSearchResults();
  const { t } = useTranslation();

  return (
    <Container>
      <Row className="h-12">
        <h1 className="text-2xl font-bold">
          {`${t('search.searchResultsTitle')} | ${t('routes.routes')}`}
        </h1>
        <CloseButton
          className="ml-auto text-base font-bold text-brand"
          onClick={handleClose}
        />
      </Row>
      <SearchContainer />
      <FiltersContainer />
      <ResultsListHeader count={resultsCount} />
      {queryParameters.filter.displayRoutes ? (
        <RoutesList routes={routes} />
      ) : (
        <LinesList lines={lines} />
      )}
    </Container>
  );
};
