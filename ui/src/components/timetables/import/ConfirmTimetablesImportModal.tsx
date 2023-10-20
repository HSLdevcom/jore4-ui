import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useConfirmTimetablesImportUIAction,
  useTimetablesImport,
} from '../../../hooks';
import { Modal, ModalBody, ModalHeader } from '../../../uiComponents';
import {
  ConfirmTimetablesImportForm,
  FormState,
} from './ConfirmTimetablesImportForm';
import { getDefaultValues } from './TimetablesImportFormSchema';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const ConfirmTimetablesImportModal: React.FC<Props> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const { t } = useTranslation();
  const { onConfirmTimetablesImport } = useConfirmTimetablesImportUIAction();
  const { vehicleScheduleFrames, importingSomeSpecialDays } =
    useTimetablesImport();

  // Default might be set incorrectly if data has not been fetched for the form.
  const formReadyForRender = !!vehicleScheduleFrames?.length;

  const onSave = async (state: FormState) => {
    await onConfirmTimetablesImport(
      vehicleScheduleFrames.map((vsf) => vsf.vehicle_schedule_frame_id),
      state.priority,
      state.timetableImportStrategy,
    );

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <ModalHeader
        onClose={onClose}
        heading={t('confirmTimetablesImportModal.title')}
      />
      <ModalBody>
        {formReadyForRender && (
          <ConfirmTimetablesImportForm
            onSubmit={onSave}
            onCancel={onClose}
            defaultValues={getDefaultValues({ importingSomeSpecialDays })}
          />
        )}
      </ModalBody>
    </Modal>
  );
};
