import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTimetablesImport } from '../../../hooks/timetables-import/useTimetablesImport';
import { Container, Row } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import { SimpleButton } from '../../../uiComponents';
import { ConfirmTimetablesImportModal } from './ConfirmTimetablesImportModal';

const testIds = {
  saveButton: 'ImportTimetablesPage::saveButton',
};

export const ImportTimetablesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { vehicleJourneys } = useTimetablesImport();
  const [isSavingImport, setIsSavingImport] = useState(false);

  const importedTimetablesExist = vehicleJourneys.length > 0;

  return (
    <Container>
      <h1>{t('timetables.importTimetablesFromHastus')}</h1>
      <Row className="space-x-3">
        <SimpleButton
          testId={testIds.saveButton}
          onClick={() => setIsSavingImport(true)}
          disabled={!importedTimetablesExist}
        >
          {t('save')}
        </SimpleButton>
        <SimpleButton
          testId={testIds.saveButton}
          href={Path.timetablesImportPreview}
          disabled={!importedTimetablesExist}
        >
          {t('timetables.openPreview')}
        </SimpleButton>
      </Row>
      <ConfirmTimetablesImportModal
        isOpen={isSavingImport}
        onClose={() => setIsSavingImport(false)}
      />
    </Container>
  );
};
