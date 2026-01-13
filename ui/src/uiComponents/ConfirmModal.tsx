import { DialogTitle } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';
import { twJoin } from 'tailwind-merge';
import { Row } from '../layoutComponents';
import { Modal, NewModalBody } from './modal';
import { SimpleButton } from './SimpleButton';

type ConfirmModalProps = {
  readonly heading: string;
  readonly isOpen: boolean;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
  readonly confirmButtonText: string;
  readonly cancelButtonText: string;
  readonly className?: string;
  readonly testId?: string;
};

const testIds = {
  cancelButton: 'ConfirmModal::cancelButton',
  confirmButton: 'ConfirmModal::confirmButton',
};

export const ConfirmModal: FC<PropsWithChildren<ConfirmModalProps>> = ({
  heading,
  isOpen,
  onCancel,
  onConfirm,
  confirmButtonText,
  cancelButtonText,
  className,
  children,
  testId,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      contentClassName={twJoin('w-1/4', className)}
      testId={testId}
    >
      <Row className="flex justify-between px-5 py-4">
        <DialogTitle as="h4">{heading}</DialogTitle>
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
