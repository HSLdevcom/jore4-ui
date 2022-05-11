import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch, useSearchResults } from '../../../hooks';
import { usePagination } from '../../../hooks/usePagination';
import { Container, Row } from '../../../layoutComponents';
import { CloseIconButton, Pagination } from '../../../uiComponents';
import { LinesList } from '../main/LinesList';
import { RoutesList } from '../main/RoutesList';
import { SearchContainer } from './conditions/SearchContainer';
import { FiltersContainer } from './filters/FiltersContainer';

export const SearchResultPage = (): JSX.Element => {
  const { queryParameters, handleClose } = useSearch();
  const { lines, routes, resultCount } = useSearchResults();
  const { t } = useTranslation();
  const { getPaginatedData } = usePagination();
  const itemsPerPage = 10;

  const displayedLines = getPaginatedData(lines, itemsPerPage);
  const displayedRoutes = getPaginatedData(routes, itemsPerPage);

  const totalCountOfDisplayedData = queryParameters.filter.displayRoutes
    ? routes?.length
    : lines?.length;

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
        <RoutesList routes={displayedRoutes} />
      ) : (
        <LinesList lines={displayedLines} />
      )}
      {lines?.length > 0 && (
        <div className="grid grid-cols-4">
          <Pagination
            className="col-span-2 col-start-2 pt-4"
            itemsPerPage={itemsPerPage}
            totalItemsCount={totalCountOfDisplayedData}
          />
        </div>
      )}
    </Container>
  );
};
