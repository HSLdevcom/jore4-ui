import { useTranslation } from 'react-i18next';
import { Container, Row } from '../../../layoutComponents';
import { CloseIconButton } from '../../../uiComponents';
import { StopsByLineSearchResults } from './by-line';
import { StopSearchByStopResults } from './by-stop';
import { SearchBy } from './SearchCriteriaRadioButtons';
import { StopSearchBar } from './StopSearchBar';
import { useStopSearch } from './useStopSearch';

const testIds = {
  container: 'StopSearchResultsPage::Container',
  closeButton: 'StopSearchResultsPage::closeButton',
};

export const StopSearchResultPage = (): React.ReactElement => {
  const { t } = useTranslation();

  const { handleClose, searchConditions } = useStopSearch();

  return (
    <Container testId={testIds.container}>
      <Row>
        <h2>{`${t('search.searchResultsTitle')} | ${t(
          'stopRegistrySearch.searchResultsTitle',
        )}`}</h2>
        <CloseIconButton
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={handleClose}
          testId={testIds.closeButton}
        />
      </Row>
      <StopSearchBar />

      {searchConditions.searchBy === SearchBy.Line ? (
        <StopsByLineSearchResults />
      ) : (
        <StopSearchByStopResults />
      )}
    </Container>
  );
};
