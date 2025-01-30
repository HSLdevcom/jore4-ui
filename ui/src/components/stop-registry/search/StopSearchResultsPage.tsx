import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, To, useLocation } from 'react-router-dom';
import { Container, Row } from '../../../layoutComponents';
import { resetSelectedRowsAction } from '../../../redux';
import { Path } from '../../../router/routeDetails';
import { defaultPagingInfo } from '../../../types';
import { PageTitle } from '../../common';
import { StopsByLineSearchResults } from './by-line';
import { StopSearchByStopResults } from './by-stop';
import { StopSearchBar } from './components';
import { StopAreaSearchResults } from './for-stop-areas/StopAreaSearchResults';
import {
  SearchBy,
  SearchFor,
  StopSearchFilters,
  StopSearchResultsProps,
  defaultSortingInfo,
} from './types';
import { trSearchFor, useStopSearchUrlState } from './utils';

const testIds = {
  container: 'StopSearchResultsPage::Container',
  closeButton: 'StopSearchResultsPage::closeButton',
};

function useCloseLink(): To {
  const { search } = useLocation();
  return { pathname: Path.stopRegistry, search };
}

const Results: FC<StopSearchResultsProps> = ({
  filters,
  pagingInfo,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  if (filters.searchBy === SearchBy.Line) {
    return (
      <StopsByLineSearchResults
        filters={filters}
        pagingInfo={pagingInfo}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
      />
    );
  }

  if (filters.searchFor === SearchFor.StopAreas) {
    return (
      <StopAreaSearchResults
        filters={filters}
        pagingInfo={pagingInfo}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
      />
    );
  }

  return (
    <StopSearchByStopResults
      filters={filters}
      pagingInfo={pagingInfo}
      setPagingInfo={setPagingInfo}
      setSortingInfo={setSortingInfo}
      sortingInfo={sortingInfo}
    />
  );
};

export const StopSearchResultPage = (): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const closeLink = useCloseLink();
  const {
    state: { filters, pagingInfo, sortingInfo },
    setFlatState,
    setPagingInfo,
    setSortingInfo,
  } = useStopSearchUrlState();

  const onSubmitFilters = (nextFilters: StopSearchFilters) => {
    dispatch(resetSelectedRowsAction());
    setFlatState({
      ...nextFilters,
      ...defaultSortingInfo,
      ...defaultPagingInfo,
      pageSize: pagingInfo.pageSize,
    });
  };

  return (
    <Container testId={testIds.container}>
      <Row>
        <PageTitle.H1>
          {`${t('search.searchResultsTitle')} | ${trSearchFor(t, filters.searchFor)}`}
        </PageTitle.H1>
        <Link
          className="ml-auto text-base font-bold text-brand"
          to={closeLink}
          data-testid={testIds.closeButton}
        >
          {t('close')}
          <i className="icon-close-large ml-4 text-lg" />
        </Link>
      </Row>
      <StopSearchBar initialFilters={filters} onSubmit={onSubmitFilters} />

      <Results
        filters={filters}
        pagingInfo={pagingInfo}
        setPagingInfo={setPagingInfo}
        setSortingInfo={setSortingInfo}
        sortingInfo={sortingInfo}
      />
    </Container>
  );
};
