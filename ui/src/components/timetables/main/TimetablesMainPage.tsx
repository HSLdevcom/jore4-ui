import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Path, routeDetails } from '../../../router/routeDetails';
import { PageTitle } from '../../common';
import { SimpleButton } from '../../common/Buttons';
import { Container, Row } from '../../common/LayoutComponents';
import { SearchContainer } from '../../routes-and-lines/search/SearchContainer';

const testIds = {
  importButton: 'TimetablesMainPage::importButton',
  settingsButton: 'TimetablesMainPage::settingsButton',
};

export const TimetablesMainPage: FC = () => {
  const { t } = useTranslation();

  const importTimetablesRoute = routeDetails[Path.timetablesImport];
  const substituteOperatingPeriodSettings =
    routeDetails[Path.substituteOperatingPeriodSettings];

  return (
    <Container>
      <Row className="items-end justify-between gap-4">
        <PageTitle.H1>{t(($) => $.timetables.timetables)}</PageTitle.H1>

        <SimpleButton
          className="ml-auto"
          id="timetables-settings-button"
          testId={testIds.settingsButton}
          href={substituteOperatingPeriodSettings.getLink()}
        >
          {t(($) => $.timetables.settingsButton)}
        </SimpleButton>
        <SimpleButton
          id="import-timetables-button"
          testId={testIds.importButton}
          href={importTimetablesRoute.getLink()}
        >
          {t(($) => $.import.importTimetables)}
        </SimpleButton>
      </Row>
      <SearchContainer />
    </Container>
  );
};
