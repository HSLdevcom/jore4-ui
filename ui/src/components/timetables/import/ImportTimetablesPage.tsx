import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useTimetablesImport } from '../../../hooks/timetables-import/useTimetablesImport';
import { Container, Row } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import { CloseIconButton, SimpleButton } from '../../../uiComponents';
import { FormRow } from '../../forms/common';
import { ConfirmTimetablesImportModal } from './ConfirmTimetablesImportModal';
import { FileImportDragAndDrop } from './FileImportDragAndDrop';

const testIds = {
  uploadButton: 'ImportTimetablesPage::uploadButton',
  saveButton: 'ImportTimetablesPage::saveButton',
  previewButton: 'ImportTimetablesPage::previewButton',
  closeButton: 'ImportTimetablesPage::closeButton',
};

export const ImportTimetablesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const { vehicleJourneys, sendToHastusImporter } = useTimetablesImport();
  const history = useHistory();

  const [fileList, setFileList] = useState<File[] | null>(null);
  const [isSavingImport, setIsSavingImport] = useState(false);

  const handleClose = () => {
    history.push(Path.timetables);
  };

  const handleSave = () => {
    setIsSavingImport(true);
  };

  const handleUpload = async () => {
    if (fileList?.length) {
      const result = await sendToHastusImporter(fileList);
      setFileList(result.failedFiles);
    }
  };

  const importedTimetablesExist = vehicleJourneys.length > 0;
  return (
    <Container>
      <Row>
        <h1>{t('import.importTimetablesFromHastus')}</h1>
        <CloseIconButton
          testId={testIds.closeButton}
          label={t('close')}
          className="ml-auto text-base font-bold text-brand"
          onClick={handleClose}
        />
      </Row>
      <FileImportDragAndDrop fileList={fileList} setFileList={setFileList} />
      <FormRow mdColumns={2}>
        <div>
          <SimpleButton
            testId={testIds.uploadButton}
            onClick={handleUpload}
            disabled={!fileList?.length}
          >
            {t('import.uploadFiles')}
          </SimpleButton>
        </div>
        <div className="flex justify-end space-x-4">
          <SimpleButton
            testId={testIds.saveButton}
            onClick={handleSave}
            disabled={!importedTimetablesExist}
          >
            {t('save')}
          </SimpleButton>
          <SimpleButton
            testId={testIds.previewButton}
            href={Path.timetablesImportPreview}
            disabled={!importedTimetablesExist}
          >
            {t('import.openPreview')}
          </SimpleButton>
        </div>
      </FormRow>
      <ConfirmTimetablesImportModal
        isOpen={isSavingImport}
        onClose={() => setIsSavingImport(false)}
      />
    </Container>
  );
};
