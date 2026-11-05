import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { OpenDefaultMapButton, PageTitle } from '..';
import { Path, routeDetails } from '../../../../router/routeDetails';
import { CloseIconButton, SimpleButton } from '../../Buttons';
import { Container, Row, Visible } from '../../LayoutComponents';
import { LoadingWrapper } from '../../Loaders';
import { CompatPagination, usePagination } from '../../Pagination';
import { ExportToolbar } from './ExportToolbar';
import { FiltersContainer } from './Filters/FiltersContainer';
import { ResultList } from './ResultList';
import { SearchContainer } from './SearchContainer';
import { RouteLineTableRowVariant } from './Types';
import { useSearch } from './useSearch';
import { useSearchResults } from './useSearchResults';

const testIds = {
  container: 'SearchResultsPage::Container',
  closeButton: 'SearchResultsPage::closeButton',
  loadingSearchResults: 'LoadingWrapper::loadingSearchResults',
  createLineButton: 'RoutesAndLinesPage::createLineButton',
  importButton: 'TimetablesMainPage::importButton',
  settingsButton: 'TimetablesMainPage::settingsButton',
};

type HeaderButtonsProps = {
  readonly hasActiveFilters: boolean;
  readonly handleClose: () => void;
  readonly rowVariant: RouteLineTableRowVariant;
};

const HeaderButtons: FC<HeaderButtonsProps> = ({
  hasActiveFilters,
  handleClose,
  rowVariant,
}) => {
  const { t } = useTranslation();

  if (hasActiveFilters) {
    return (
      <CloseIconButton
        label={t(($) => $.close)}
        className="ml-auto text-base font-bold text-brand"
        onClick={handleClose}
        testId={testIds.closeButton}
      />
    );
  }

  if (rowVariant === RouteLineTableRowVariant.RoutesAndLines) {
    return (
      <>
        <OpenDefaultMapButton className="ml-auto" />
        <SimpleButton
          id="create-line-button"
          data-testid={testIds.createLineButton}
          className="ml-3"
          href={routeDetails[Path.createLine].getLink()}
        >
          {t(($) => $.lines.createNew)}
        </SimpleButton>
      </>
    );
  }

  return (
    <>
      <SimpleButton
        className="ml-auto"
        id="timetables-settings-button"
        testId={testIds.settingsButton}
        href={routeDetails[Path.substituteOperatingPeriodSettings].getLink()}
      >
        {t(($) => $.timetables.settingsButton)}
      </SimpleButton>
      <SimpleButton
        id="import-timetables-button"
        testId={testIds.importButton}
        href={routeDetails[Path.timetablesImport].getLink()}
      >
        {t(($) => $.import.importTimetables)}
      </SimpleButton>
    </>
  );
};

export const SearchResultPage: FC = () => {
  const { handleClose, queryParameters } = useSearch();
  const { t } = useTranslation();
  const { getPaginatedData } = usePagination();
  const searchResults = useSearchResults(queryParameters);
  const { lines, reducedRoutes, loading, resultCount } = searchResults;
  const { pathname } = useLocation();
  const itemsPerPage = 10;

  const location = useLocation();
  const [searchIsExpanded, setSearchIsExpanded] = useState<boolean>(
    location.state?.searchExpanded,
  );

  const displayedLines = getPaginatedData(lines, itemsPerPage);
  const displayedRoutes = getPaginatedData(reducedRoutes, itemsPerPage);

  const determineDisplayInformation = () => {
    switch (pathname) {
      case Path.timetablesSearch:
        return {
          title: t(($) => $.timetables.timetables),
          rowVariant: RouteLineTableRowVariant.Timetables,
        };
      case Path.routesSearch:
      default:
        return {
          title: t(($) => $.routes.routes),
          rowVariant: RouteLineTableRowVariant.RoutesAndLines,
        };
    }
  };

  const displayInformation = determineDisplayInformation();

  return (
    <Container testId={testIds.container}>
      <Row className="items-end justify-between gap-4">
        <PageTitle.H1>
          {queryParameters.hasActiveFilters
            ? `${t(($) => $.search.searchResultsTitle)} | ${displayInformation.title}`
            : displayInformation.title}
        </PageTitle.H1>
        <HeaderButtons
          hasActiveFilters={queryParameters.hasActiveFilters}
          handleClose={() => handleClose({ searchExpanded: searchIsExpanded })}
          rowVariant={displayInformation.rowVariant}
        />
      </Row>
      <SearchContainer searchExpandChanged={setSearchIsExpanded} />
      {queryParameters.hasActiveFilters && (
        <LoadingWrapper
          className="flex justify-center"
          loadingText={t(($) => $.search.searching)}
          loading={loading}
          testId={testIds.loadingSearchResults}
        >
          <FiltersContainer />
          <ExportToolbar searchResult={searchResults} />
          <ResultList
            lines={displayedLines}
            routes={displayedRoutes}
            rowVariant={displayInformation.rowVariant}
            displayedType={queryParameters.filter.displayedType}
          />
          <Visible visible={!!resultCount}>
            <div className="grid grid-cols-4">
              <CompatPagination
                className="col-span-2 col-start-2 pt-4"
                itemsPerPage={itemsPerPage}
                totalItemsCount={resultCount}
              />
            </div>
          </Visible>
        </LoadingWrapper>
      )}
    </Container>
  );
};
