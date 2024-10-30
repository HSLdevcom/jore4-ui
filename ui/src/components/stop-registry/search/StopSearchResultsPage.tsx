import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, To, useLocation } from 'react-router-dom';
import { Container, Row } from '../../../layoutComponents';
import { resetSelectedRowsAction } from '../../../redux';
import { Path } from '../../../router/routeDetails';
import { StopsByLineSearchResults } from './by-line';
import { StopSearchByStopResults } from './by-stop';
import { StopSearchBar } from './components';
import { StopAreaSearchResults } from './for-stop-areas/StopAreaSearchResults';
import { SearchBy, SearchFor, StopSearchFilters } from './types';
import { trSearchFor, useStopSearchUrlState } from './utils';

const testIds = {
  container: 'StopSearchResultsPage::Container',
  closeButton: 'StopSearchResultsPage::closeButton',
};

function useCloseLink(): To {
  const { search } = useLocation();
  return { pathname: Path.stopRegistry, search };
}

const Results: FC<{ readonly filters: StopSearchFilters }> = ({ filters }) => {
  if (filters.searchBy === SearchBy.Line) {
    return <StopsByLineSearchResults filters={filters} />;
  }

  if (filters.searchFor === SearchFor.StopAreas) {
    return <StopAreaSearchResults filters={filters} />;
  }

  return <StopSearchByStopResults filters={filters} />;
};

export const StopSearchResultPage = (): React.ReactElement => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const closeLink = useCloseLink();
  const [urlState, setUrlState] = useStopSearchUrlState();

  const onSubmitFilters = (filters: StopSearchFilters) => {
    dispatch(resetSelectedRowsAction());
    setUrlState((p) => ({ ...p, ...filters }));
  };

  return (
    <Container testId={testIds.container}>
      <Row>
        <h2>{`${t('search.searchResultsTitle')} | ${trSearchFor(t, urlState.searchFor)}`}</h2>
        <Link
          className="ml-auto text-base font-bold text-brand"
          to={closeLink}
          data-testid={testIds.closeButton}
        >
          {t('close')}
          <i className="icon-close-large ml-4 text-lg" />
        </Link>
      </Row>
      <StopSearchBar initialFilters={urlState} onSubmit={onSubmitFilters} />

      <Results filters={urlState} />
    </Container>
  );
};
