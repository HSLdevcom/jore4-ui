import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../../../hooks';
import { useConfirmTimetablesImport } from '../../../hooks/timetables-import/useConfirmTimetablesImport';
import { Operation } from '../../../redux';
import { TimetablePriority } from '../../../types/Priority';
import { Modal, ModalBody, ModalHeader } from '../../../uiComponents';
import { showSuccessToast } from '../../../utils';
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
  const { setIsLoading } = useLoader(Operation.ConfirmTimetablesImport);

  const onSave = async (state: FormState) => {
    setIsLoading(true);

    try {
      await confirmTimetablesImport(
        state.priority as unknown as TimetablePriority,
      );
      showSuccessToast(t('timetables.importSuccess'));

      onClose();
    } finally {
      setIsLoading(false);
    }
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
