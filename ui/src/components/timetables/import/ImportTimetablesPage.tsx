import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';
import { useTimetablesImport } from '../../../hooks/timetables-import/useTimetablesImport';
import { Container, Row } from '../../../layoutComponents';
import { selectIsJoreOperationLoading } from '../../../redux';
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
  abortButton: 'ImportTimetablesPage::abortButton',
  saveButton: 'ImportTimetablesPage::saveButton',
  previewButton: 'ImportTimetablesPage::previewButton',
  closeButton: 'ImportTimetablesPage::closeButton',
  loading: 'ImportTimetablesPage::LoadingOverlay',
};

export const ImportTimetablesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    vehicleJourneys,
    vehicleScheduleFrames,
    sendToHastusImporter,
    abortTimetablesImport,
  } = useTimetablesImport();

  const [fileList, setFileList] = useState<File[] | null>(null);
  const [isAbortImportModalOpen, setIsAbortImportModalOpen] = useState(false);
  const [isConfirmImportModalOpen, setIsConfirmImportModalOpen] =
    useState(false);

  const isLoading = useAppSelector(selectIsJoreOperationLoading);

  const handleClose = () => {
    navigate(Path.timetables);
  };

  const openAbortImportModal = () => {
    setIsAbortImportModalOpen(true);
  };

  const onConfirmAbortImport = async () => {
    try {
      await abortTimetablesImport(
        vehicleScheduleFrames.map((vsf) => vsf.vehicle_schedule_frame_id),
      );

      setIsAbortImportModalOpen(false);
      showSuccessToast(t('import.abortedSuccessfully'));
    } catch (err) {
      showDangerToastWithError(t('errors.saveFailed'), err);
    }
  };

  const openConfirmImportModal = () => {
    setIsConfirmImportModalOpen(true);
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
          disabled={!fileList?.length || isLoading}
        >
          {t('import.uploadFiles')}
        </SimpleButton>
        <div className="flex justify-end space-x-4">
          <SimpleButton
            testId={testIds.abortButton}
            onClick={openAbortImportModal}
            disabled={!importedTimetablesExist || isLoading}
          >
            {t('import.abort')}
          </SimpleButton>
          <SimpleButton
            testId={testIds.saveButton}
            onClick={openConfirmImportModal}
            disabled={!importedTimetablesExist || isLoading}
          >
            {t('save')}
          </SimpleButton>
          <SimpleButton
            testId={testIds.previewButton}
            href={Path.timetablesImportPreview}
            disabled={!importedTimetablesExist || isLoading}
          >
            {t('import.openPreview')}
          </SimpleButton>
        </div>
      </FormRow>
      <ConfirmationDialog
        isOpen={isAbortImportModalOpen}
        onCancel={() => setIsAbortImportModalOpen(false)}
        onConfirm={onConfirmAbortImport}
        widthClassName="max-w-md"
        title={t('confirmTimetablesAbortImportDialog.title')}
        description={t('confirmTimetablesAbortImportDialog.description')}
        confirmText={t('confirmTimetablesAbortImportDialog.confirm')}
        cancelText={t('confirmTimetablesAbortImportDialog.abort')}
      />
      <ConfirmTimetablesImportModal
        isOpen={isConfirmImportModalOpen}
        onClose={() => {
          setIsConfirmImportModalOpen(false);
        }}
      />
    </Container>
  );
};
