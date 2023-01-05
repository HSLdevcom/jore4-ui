import { useTranslation } from 'react-i18next';
import { Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { SearchContainer } from '../../routes-and-lines/search/SearchContainer';

const testIds = {
  importButton: 'TimetablesMainPage::importButton',
};

export const TimetablesMainPage = (): JSX.Element => {
  const { t } = useTranslation();

  const importTimetablesRoute = routeDetails[Path.timetablesImport];

  return (
    <Container>
      <Row>
        <h1>{t('timetables.timetables')}</h1>
        <SimpleButton
          id="import-timetables-button"
          data-testid={testIds.importButton}
          containerClassName="ml-auto"
          href={importTimetablesRoute.getLink()}
        >
          {t('timetables.import')}
        </SimpleButton>
      </Row>
      <SearchContainer />
    </Container>
  );
};
