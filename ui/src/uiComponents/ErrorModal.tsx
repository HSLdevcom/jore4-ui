import { Dialog } from '@headlessui/react';
import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Row } from '../layoutComponents';
import { CloseIconButton } from './CloseIconButton';
import { Modal, NewModalBody } from './modal';
import { SimpleButton } from './SimpleButton';

interface Props {
  heading: string;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}
const testIds = {
  modal: 'ErrorModal::modal',
  closeButton: 'ErrorModal::closeButton',
  closeIconButton: 'ErrorModal::closeIconButton',
};

export const ErrorModal: FC<Props> = ({
  heading,
  isOpen,
  onClose,
  className = '',
  bodyClassName = '',
  children,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      testId={testIds.modal}
      onClose={onClose}
      dialogClassName="z-50" // Display on top of other possible modals.
      contentClassName={twMerge('w-1/4', className)}
    >
      <Row className="flex items-start justify-between px-5 pb-2 pt-4">
        <div className="flex space-x-1">
          <i className="icon-alert text-lg text-hsl-red" />
          <Dialog.Title as="h4">{heading}</Dialog.Title>
        </div>
        <CloseIconButton onClick={onClose} testId={testIds.closeIconButton} />
      </Row>
      <NewModalBody className={bodyClassName}>{children}</NewModalBody>
      <Row className="justify-end space-x-1 px-5 pb-4 pt-2">
        <SimpleButton testId={testIds.closeButton} onClick={onClose}>
          {t('close')}
        </SimpleButton>
      </Row>
    </Modal>
  );
};
