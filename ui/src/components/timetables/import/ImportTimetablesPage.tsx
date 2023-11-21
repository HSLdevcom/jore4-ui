import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTimetablesImport } from '../../../hooks/timetables-import/useTimetablesImport';
import { Container, Row } from '../../../layoutComponents';
import { Path } from '../../../router/routeDetails';
import {
  CloseIconButton,
  ConfirmationDialog,
  SimpleButton,
} from '../../../uiComponents';
import { ErrorDialog } from '../../../uiComponents/ErrorDialog';
import { ErrorDialogItem } from '../../../uiComponents/ErrorDialogItem';
import { showSuccessToast } from '../../../utils';
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

export type ImportError = {
  name: string;
  fileName: string;
  httpStatus?: number;
  httpText?: string;
  reason: string;
};

export const ImportTimetablesPage = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    vehicleJourneys,
    vehicleScheduleFrames,
    sendToHastusImporter,
    cancelTimetablesImport,
  } = useTimetablesImport();

  const [fileList, setFileList] = useState<File[] | null>(null);
  const [isCancelingImport, setIsCancelingImport] = useState(false);
  const [isSavingImport, setIsSavingImport] = useState(false);
  const [isSendingToHastus, setIsSendingToHastus] = useState(false);
  const [errorList, setImportErrors] = useState<ImportError[] | []>([]);

  const handleClose = () => {
    navigate(Path.timetables);
  };

  const handleCancel = () => {
    setIsCancelingImport(true);
  };

  const onConfirmCancelingImport = async () => {
    try {
      await cancelTimetablesImport(
        vehicleScheduleFrames.map((vsf) => vsf.vehicle_schedule_frame_id),
      );

      setIsCancelingImport(false);
      showSuccessToast(t('import.cancelledSuccessfully'));
    } catch (error) {
      setImportErrors([
        {
          name: t('import.fileUploadFailed'),
          fileName: vehicleScheduleFrames[0].name_i18n,
          httpText: error.message,
          reason: t('errors.saveFailed'),
        },
      ]);
    }
  };

  const handleSave = () => {
    setIsSavingImport(true);
  };

  const handleUpload = async () => {
    if (fileList?.length) {
      setIsSendingToHastus(true);
      const result = await sendToHastusImporter(fileList);
      setIsSendingToHastus(false);
      const errors: ImportError[] = [];
      setFileList(
        result.failedFiles.map((failures) => {
          const filename = failures[0].name;
          errors.push({
            name: t('import.fileUploadFailed', { filename }),
            fileName: filename,
            httpStatus: failures[1].response.status,
            httpText: failures[1].message,
            reason: failures[1].response.data.reason,
          });
          return failures[0];
        }),
      );
      if (errors.length > 0) {
        setImportErrors(errors);
      }
    }
  };

  const hasErrors = () => {
    return errorList.length > 0;
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
          disabled={!fileList?.length || isSendingToHastus}
        >
          {t('import.uploadFiles')}
        </SimpleButton>
        <div className="flex justify-end space-x-4">
          <SimpleButton
            testId={testIds.cancelButton}
            onClick={handleCancel}
            disabled={!importedTimetablesExist || isSendingToHastus}
          >
            {t('import.cancel')}
          </SimpleButton>
          <SimpleButton
            testId={testIds.saveButton}
            onClick={handleSave}
            disabled={!importedTimetablesExist || isSendingToHastus}
          >
            {t('save')}
          </SimpleButton>
          <SimpleButton
            testId={testIds.previewButton}
            href={Path.timetablesImportPreview}
            disabled={!importedTimetablesExist || isSendingToHastus}
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
      {hasErrors() && (
        <ErrorDialog
          isOpen={hasErrors()}
          retryable={false}
          onRetry={() => {
            return undefined;
          }}
          onCancel={() => setImportErrors([])}
          title={
            errorList.length > 1
              ? t('import.multipleErrors')
              : t('import.fileUploadFailed', {
                  filename: (fileList ?? [])[0].name ?? '',
                })
          }
          widthClassName="max-w-2xl"
        >
          {errorList.map((error) => {
            return (
              <ErrorDialogItem
                customTitle={errorList.length === 1 ? '' : error.name}
                description={error.reason}
                httpCode={error.httpStatus}
                httpText={error.httpText}
                key={error.name}
              />
            );
          })}
        </ErrorDialog>
      )}
    </Container>
  );
};
