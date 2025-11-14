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
  defaultFilters,
  defaultResultSelection,
  defaultSortingInfo,
} from './types';
import {
  SearchRouterStateContextProvider,
  trSearchFor,
  useStopSearchRouterState,
} from './utils';

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

const Results: FC<{ readonly filters: StopSearchFilters }> = ({ filters }) => {
  if (filters.searchBy === SearchBy.Line) {
    return <StopsByLineSearchResults />;
  }

  if (filters.searchFor === SearchFor.StopAreas) {
    return <StopAreaSearchResults />;
  }

  if (filters.searchFor === SearchFor.Terminals) {
    return <TerminalSearchResults />;
  }

  return <StopSearchByStopResults />;
};

function resultWillBeGrouped(filters: StopSearchFilters): boolean {
  return (
    filters.searchFor !== SearchFor.Stops || filters.searchBy === SearchBy.Line
  );
}

const StopSearchResultPageImpl: FC = () => {
  const {
    state: { filters, pagingInfo },
    historyState,
    setHistoryState,
    setSearchState,
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
    setHistoryState((p) => ({
      ...p,
      resultSelection: defaultResultSelection,
      selectedGroups: [],
      knownStopIds: resultWillBeGrouped(nextFilters)
        ? { listingMode: 'grouped', ids: [], groups: {} }
        : { listingMode: 'flat', ids: [] },
    }));
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
        searchIsExpanded={historyState.searchIsExpanded}
        toggleSearchIsExpanded={() =>
          setHistoryState((p) => ({
            ...p,
            searchIsExpanded: !p.searchIsExpanded,
          }))
        }
        onSubmit={onSubmitFilters}
      />

      {hasActiveFilters && <Results filters={filters} />}
    </Container>
  );
};

export const StopSearchResultPage: FC = () => {
  return (
    <SearchRouterStateContextProvider>
      <StopSearchResultPageImpl />
    </SearchRouterStateContextProvider>
  );
};
