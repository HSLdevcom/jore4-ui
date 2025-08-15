import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { extractErrorType, getImportErrorBody } from '../../../api/hastus';
import { useAppSelector } from '../../../hooks';
import { useTimetablesImport } from '../../../hooks/timetables-import/useTimetablesImport';
import { mapHastusErrorTypeToErrorMessage } from '../../../i18n/hastusErrorMappings';
import { Container, Row } from '../../../layoutComponents';
import {
  ErrorListItem,
  openErrorListModalAction,
  selectIsJoreOperationLoading,
} from '../../../redux';
import { Path } from '../../../router/routeDetails';
import {
  CloseIconButton,
  ConfirmationDialog,
  SimpleButton,
} from '../../../uiComponents';
import { showDangerToastWithError, showSuccessToast } from '../../../utils';
import { PageTitle } from '../../common';
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

export const ImportTimetablesPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    vehicleJourneys,
    vehicleScheduleFrames,
    sendToHastusImporter,
    abortTimetablesImport,
  } = useTimetablesImport();

  const [fileList, setFileList] = useState<ReadonlyArray<File> | null>(null);
  const [isAbortImportModalOpen, setIsAbortImportModalOpen] = useState(false);
  const [isConfirmImportModalOpen, setIsConfirmImportModalOpen] =
    useState(false);
  const dispatch = useDispatch();

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

      const failedFiles = result.failedFiles.map((failure) => failure.file);
      setFileList(failedFiles);

      if (result.failedFiles.length) {
        const importErrors: ErrorListItem[] = result.failedFiles.map(
          (failure) => {
            const filename = failure.file.name;

            return {
              errorTitle: t('import.fileUploadFailed', { filename }),
              details: mapHastusErrorTypeToErrorMessage(
                t,
                extractErrorType(getImportErrorBody(failure.error)),
              ),
              additionalDetails: failure.error.response?.data?.reason ?? '',
              key: filename,
            };
          },
        );
        dispatch(
          openErrorListModalAction({
            errorModalTitle: t('import.errorModalTitle'),
            errorList: importErrors,
          }),
        );
      }
    }
  };

  const importedTimetablesExist = vehicleJourneys.length > 0;
  return (
    <Container>
      <Row>
        <PageTitle.H1>{t('import.importTimetablesFromHastus')}</PageTitle.H1>
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
