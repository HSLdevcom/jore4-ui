import { Dispatch, FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, To, useLocation } from 'react-router-dom';
import { Container, Row } from '../../../layoutComponents';
import { resetSelectedRowsAction } from '../../../redux';
import { Path } from '../../../router/routeDetails';
import { PagingInfo, defaultPagingInfo } from '../../../types';
import { StopsByLineSearchResults } from './by-line';
import { StopSearchByStopResults } from './by-stop';
import { StopSearchBar } from './components';
import { StopAreaSearchResults } from './for-stop-areas/StopAreaSearchResults';
import {
  SearchBy,
  SearchFor,
  SortingInfo,
  StopSearchFilters,
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

type ResultsProps = {
  readonly filters: StopSearchFilters;
  readonly pagingInfo: PagingInfo;
  readonly setPagingInfo: (pagingInfo: PagingInfo) => void;
  readonly setSortingInfo: Dispatch<SetStateAction<SortingInfo>>;
  readonly sortingInfo: SortingInfo;
};

const Results: FC<ResultsProps> = ({
  filters,
  pagingInfo,
  setPagingInfo,
  setSortingInfo,
  sortingInfo,
}) => {
  if (filters.searchBy === SearchBy.Line) {
    return <StopsByLineSearchResults filters={filters} />;
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
      ...defaultPagingInfo,
      ...defaultSortingInfo,
    });
  };

  return (
    <Container testId={testIds.container}>
      <Row>
        <h2>{`${t('search.searchResultsTitle')} | ${trSearchFor(t, filters.searchFor)}`}</h2>
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
