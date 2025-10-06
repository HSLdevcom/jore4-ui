import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row } from '../../../layoutComponents';
import { defaultPagingInfo } from '../../../types';
import { CloseIconButton } from '../../../uiComponents';
import { areEqual } from '../../../utils';
import { PageTitle } from '../../common';
import { OpenDefaultMapButton } from '../../common/OpenDefaultMapButton';
import { StopsByLineSearchResults } from './by-line';
import { StopSearchByStopResults } from './by-stop';
import { StopSearchBar } from './components';
import { StopAreaSearchResults } from './for-stop-areas/StopAreaSearchResults';
import { TerminalSearchResults } from './for-terminals/TerminalSearchResults';
import {
  SearchBy,
  SearchFor,
  StopSearchFilters,
  StopSearchResultsProps,
  defaultFilters,
  defaultSortingInfo,
} from './types';
import { trSearchFor, useStopSearchRouterState } from './utils';

const testIds = {
  container: 'StopSearchResultsPage::Container',
  closeButton: 'StopSearchResultsPage::closeButton',
};

const NoFiltersHeader: FC = () => {
  const { t } = useTranslation();

  return (
    <Row className="justify-between">
      <PageTitle.H1>{t('stops.stops')}</PageTitle.H1>
      <OpenDefaultMapButton />
    </Row>
  );
};

type ActiveFiltersHeaderProps = {
  readonly resetSearch: () => void;
  readonly searchFor: SearchFor;
};

const ActiveFiltersHeader: FC<ActiveFiltersHeaderProps> = ({
  resetSearch,
  searchFor,
}) => {
  const { t } = useTranslation();

  return (
    <Row className="justify-between">
      <PageTitle.H1>
        {t('search.searchResultsTitleFor', {
          for: trSearchFor(t, searchFor),
        })}
      </PageTitle.H1>
      <CloseIconButton
        className="text-lg font-bold text-brand"
        label={t('close')}
        onClick={resetSearch}
        testId={testIds.closeButton}
      />
    </Row>
  );
};

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

  if (filters.searchFor === SearchFor.Terminals) {
    return (
      <TerminalSearchResults
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

export const StopSearchResultPage: FC = () => {
  const {
    state: { filters, pagingInfo, sortingInfo },
    historyState: { searchIsExpanded },
    setHistoryState,
    setPagingInfo,
    setSearchState,
    setSortingInfo,
  } = useStopSearchRouterState();

  const hasActiveFilters = !areEqual(defaultFilters, filters);

  const onSubmitFilters = (nextFilters: StopSearchFilters) => {
    setSearchState({
      ...defaultFilters,
      ...nextFilters,
      ...defaultSortingInfo,
      ...defaultPagingInfo,
      pageSize: pagingInfo.pageSize,
    });
  };

  return (
    <Container testId={testIds.container}>
      {hasActiveFilters ? (
        <ActiveFiltersHeader
          resetSearch={() =>
            setSearchState({
              ...defaultFilters,
              ...defaultSortingInfo,
              ...defaultPagingInfo,
            })
          }
          searchFor={filters.searchFor}
        />
      ) : (
        <NoFiltersHeader />
      )}

      <StopSearchBar
        initialFilters={filters}
        searchIsExpanded={searchIsExpanded}
        toggleSearchIsExpanded={() =>
          setHistoryState((p) => ({
            ...p,
            searchIsExpanded: !p.searchIsExpanded,
          }))
        }
        onSubmit={onSubmitFilters}
      />

      {hasActiveFilters && (
        <Results
          filters={filters}
          pagingInfo={pagingInfo}
          setPagingInfo={setPagingInfo}
          setSortingInfo={setSortingInfo}
          sortingInfo={sortingInfo}
        />
      )}
    </Container>
  );
};
