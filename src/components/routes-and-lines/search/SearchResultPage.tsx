import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch, useSearchResults } from '../../../hooks';
import { Container, Row } from '../../../layoutComponents';
import { CloseIconButton } from '../../../uiComponents';
import { LinesList } from '../LinesList'; // eslint-disable-line import/no-cycle
import { RoutesList } from '../RoutesList'; // eslint-disable-line import/no-cycle
import { SearchContainer } from './conditions/SearchContainer';
import { FiltersContainer } from './filters/FiltersContainer';

export const SearchResultPage = (): JSX.Element => {
  const { queryParameters, handleClose } = useSearch();
  const { lines, routes, resultCount } = useSearchResults();
  const { t } = useTranslation();

  return (
    <Container>
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
      {queryParameters.filter.displayRoutes ? (
        <RoutesList routes={routes} />
      ) : (
        <LinesList lines={lines} />
      )}
    </Container>
  );
};
