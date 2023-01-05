import React from 'react';
import { useTranslation } from 'react-i18next';
import { useConfirmTimetablesImport } from '../../../hooks/timetables-import/useConfirmTimetablesImport';
import { TimetablePriority } from '../../../types/Priority';
import { Modal, ModalBody, ModalHeader } from '../../../uiComponents';
import {
  ConfirmTimetablesImportForm,
  FormState,
} from './ConfirmTimetablesImportForm';

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
  const { confirmTimetablesImport } = useConfirmTimetablesImport();

  const onSave = async (state: FormState) => {
    await confirmTimetablesImport(
      state.priority as unknown as TimetablePriority,
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
        <ConfirmTimetablesImportForm onSubmit={onSave} onCancel={onClose} />
      </ModalBody>
    </Modal>
  );
};
