import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useConfirmTimetablesImport } from '../../../hooks/timetables-import/useConfirmTimetablesImport';
import { Container } from '../../../layoutComponents';
import { SimpleButton } from '../../../uiComponents';
import { ConfirmTimetablesImportModal } from './ConfirmTimetablesImportModal';

const testIds = {
  saveButton: 'ImportTimetablesPage::saveButton',
};

export const ImportTimetablesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { vehicleServiceCount } = useConfirmTimetablesImport();
  const [isSavingImport, setIsSavingImport] = useState(false);

  const importedTimetablesExist = vehicleServiceCount > 0;

  return (
    <Container>
      <h1>{t('timetables.importTimetablesFromHastus')}</h1>
      <SimpleButton
        testId={testIds.saveButton}
        onClick={() => setIsSavingImport(true)}
        disabled={!importedTimetablesExist}
      >
        {t('save')}
      </SimpleButton>
      <ConfirmTimetablesImportModal
        isOpen={isSavingImport}
        onClose={() => setIsSavingImport(false)}
      />
    </Container>
  );
};
