import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { useTimetablesImport } from '../../../hooks/timetables-import/useTimetablesImport';
import { Container, Row } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import {
  CloseIconButton,
  ConfirmationDialog,
  SimpleButton,
} from '../../../uiComponents';
import { showDangerToastWithError, showSuccessToast } from '../../../utils';
import { FormRow } from '../../forms/common';
import { ConfirmTimetablesImportModal } from './ConfirmTimetablesImportModal';
import { FileImportDragAndDrop } from './FileImportDragAndDrop';

const testIds = {
  uploadButton: 'ImportTimetablesPage::uploadButton',
  cancelButton: 'ImportTimetablesPage::cancelButton',
  saveButton: 'ImportTimetablesPage::saveButton',
  previewButton: 'ImportTimetablesPage::previewButton',
  closeButton: 'ImportTimetablesPage::closeButton',
};

export const ImportTimetablesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const history = useHistory();
  const { vehicleJourneys, sendToHastusImporter, cancelTimetablesImport } =
    useTimetablesImport();

  const [fileList, setFileList] = useState<File[] | null>(null);
  const [isCancelingImport, setIsCancelingImport] = useState(false);
  const [isSavingImport, setIsSavingImport] = useState(false);

  const handleClose = () => {
    history.push(Path.timetables);
  };

  const handleCancel = () => {
    setIsCancelingImport(true);
  };

  const onConfirmCancelingImport = async () => {
    try {
      await cancelTimetablesImport();

      setIsCancelingImport(false);
      showSuccessToast(t('import.cancelledSuccessfully'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
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
        <SimpleButton
          testId={testIds.uploadButton}
          onClick={handleUpload}
          disabled={!fileList?.length}
        >
          {t('import.uploadFiles')}
        </SimpleButton>
        <div className="flex justify-end space-x-4">
          <SimpleButton
            testId={testIds.cancelButton}
            onClick={handleCancel}
            disabled={!importedTimetablesExist}
          >
            {t('import.cancel')}
          </SimpleButton>
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
      <ConfirmationDialog
        isOpen={isCancelingImport}
        onCancel={() => setIsCancelingImport(false)}
        onConfirm={onConfirmCancelingImport}
        widthClassName="max-w-md"
        title={t('confirmTimetablesCancelImportDialog.title')}
        description={t('confirmTimetablesCancelImportDialog.description')}
        confirmText={t('confirmTimetablesCancelImportDialog.confirm')}
        cancelText={t('confirmTimetablesCancelImportDialog.cancel')}
      />
      <ConfirmTimetablesImportModal
        isOpen={isSavingImport}
        onClose={() => setIsSavingImport(false)}
      />
    </Container>
  );
};
