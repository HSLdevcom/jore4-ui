import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from '../../../hooks/search/useSearch';
import { useSearchResults } from '../../../hooks/search/useSearchResults';
import { Container, Row } from '../../../layoutComponents';
import { CloseButton } from './CloseButton';
import { SearchContainer } from './conditions/SearchContainer';
import { FiltersContainer } from './filters/FiltersContainer';
import { LinesResultTable } from './results/LinesResultTable'; // eslint-disable-line import/no-cycle
import { ResultsTableHeader } from './results/ResultsTableHeader';
import { RoutesResultTable } from './results/RoutesResultTable'; // eslint-disable-line import/no-cycle

export const SearchResultPage = (): JSX.Element => {
  const { queryParameters, handleClose } = useSearch();
  const { lines, routes, resultsCount } = useSearchResults();
  const { t } = useTranslation();

  return (
    <Container>
      <Row className="h-12">
        <h1 className="text-2xl font-bold">
          {t('search.searchResultsTitle')} | {t('routes.routes')}
        </h1>
        <CloseButton onClose={handleClose} />
      </Row>
      <SearchContainer />

      <FiltersContainer />

      <ResultsTableHeader count={resultsCount} />
      {queryParameters.filter.displayRoutes ? (
        <RoutesResultTable routes={routes} />
      ) : (
        <LinesResultTable lines={lines} />
      )}
    </Container>
  );
};
