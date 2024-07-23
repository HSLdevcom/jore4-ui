import { useTranslation } from 'react-i18next';
import { Container, Row } from '../../../layoutComponents';
import { Path, routeDetails } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { SearchContainer } from '../../routes-and-lines/search/SearchContainer';

const testIds = {
  importButton: 'TimetablesMainPage::importButton',
  settingsButton: 'TimetablesMainPage::settingsButton',
};

export const TimetablesMainPage = (): JSX.Element => {
  const { t } = useTranslation();

  const importTimetablesRoute = routeDetails[Path.timetablesImport];
  const substituteOperatingPeriodSettings =
    routeDetails[Path.substituteOperatingPeriodSettings];

  return (
    <Container>
      <Row>
        <h1>{t('timetables.timetables')}</h1>
        <SimpleButton
          id="timetables-settings-button"
          testId={testIds.settingsButton}
          containerClassName="ml-auto"
          href={substituteOperatingPeriodSettings.getLink()}
        >
          {t('timetables.settingsButton')}
        </SimpleButton>
        <SimpleButton
          id="import-timetables-button"
          testId={testIds.importButton}
          containerClassName="ml-3"
          href={importTimetablesRoute.getLink()}
        >
          {t('import.importTimetables')}
        </SimpleButton>
      </Row>
      <SearchContainer />
    </Container>
  );
};
