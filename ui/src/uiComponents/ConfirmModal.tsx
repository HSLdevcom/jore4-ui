import { Dialog } from '@headlessui/react';
import { FunctionComponent } from 'react';
import { twMerge } from 'tailwind-merge';
import { Row } from '../layoutComponents';
import { Modal, NewModalBody } from './modal';
import { SimpleButton } from './SimpleButton';

interface Props {
  heading: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirmButtonText: string;
  cancelButtonText: string;
  className?: string;
}
const testIds = {
  cancelButton: 'ConfirmModal::cancelButton',
  confirmButton: 'ConfirmModal::confirmButton',
};

export const ConfirmModal: FunctionComponent<Props> = ({
  heading,
  isOpen,
  onCancel,
  onConfirm,
  confirmButtonText,
  cancelButtonText,
  className = '',
  children,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      contentClassName={twMerge('w-1/4', className)}
    >
      <Row className="flex justify-between px-5 py-4">
        <Dialog.Title as="h4">{heading}</Dialog.Title>
      </Row>
      <NewModalBody>{children}</NewModalBody>
      <Row className="justify-end space-x-1 px-5 py-4">
        <SimpleButton testId={testIds.cancelButton} onClick={onCancel} inverted>
          {cancelButtonText}
        </SimpleButton>
        <SimpleButton testId={testIds.confirmButton} onClick={onConfirm}>
          {confirmButtonText}
        </SimpleButton>
      </Row>
    </Modal>
  );
};
