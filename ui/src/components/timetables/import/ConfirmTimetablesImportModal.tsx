import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  useConfirmTimetablesImportUIAction,
  useTimetablesImport,
} from '../../../hooks';
import { Visible } from '../../../layoutComponents';
import { Modal, NewModalBody, NewModalHeader } from '../../../uiComponents';
import { ConfirmTimetablesImportForm } from './ConfirmTimetablesImportForm';
import { FormState, getDefaultValues } from './TimetablesImportFormSchema';

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
  const { onConfirmTimetablesImport, showConfirmFailedErrorDialog } =
    useConfirmTimetablesImportUIAction();
  const {
    vehicleScheduleFrames,
    importingSomeSpecialDays,
    inconsistentSpecialDayPrioritiesStaged,
  } = useTimetablesImport();

  // Default might be set incorrectly if data has not been fetched for the form.
  const formReadyForRender = !!vehicleScheduleFrames?.length;

  const onSave = async (state: FormState) => {
    try {
      await onConfirmTimetablesImport(
        vehicleScheduleFrames.map((vsf) => vsf.vehicle_schedule_frame_id),
        state.priority,
        state.timetableImportStrategy,
      );

      onClose();
    } catch (error) {
      showConfirmFailedErrorDialog(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} contentClassName={className}>
      <NewModalHeader
        onClose={onClose}
        heading={t('confirmTimetablesImportModal.title')}
      />
      <NewModalBody>
        <Visible visible={formReadyForRender}>
          <ConfirmTimetablesImportForm
            onSubmit={onSave}
            onCancel={onClose}
            inconsistentSpecialDayPrioritiesStaged={
              inconsistentSpecialDayPrioritiesStaged
            }
            defaultValues={getDefaultValues({ importingSomeSpecialDays })}
          />
        </Visible>
      </NewModalBody>
    </Modal>
  );
};
