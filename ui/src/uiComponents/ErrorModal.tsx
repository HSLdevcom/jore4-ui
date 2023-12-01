import { Dialog } from '@headlessui/react';
import { FunctionComponent } from 'react';
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
}
const testIds = {
  closeButton: 'ErrorModal::closeButton',
  closeIconButton: 'ErrorModal::closeIconButton',
};

export const ErrorModal: FunctionComponent<Props> = ({
  heading,
  isOpen,
  onClose,
  className,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={twMerge('w-1/4', className)}
    >
      <Row className="flex items-end  justify-between px-5 pt-4 pb-2">
        <div className="flex items-end space-x-1">
          <i className="icon-alert text-xl text-hsl-red" />
          <Dialog.Title as="h4">{heading}</Dialog.Title>
        </div>
        <CloseIconButton onClick={onClose} testId={testIds.closeIconButton} />
      </Row>
      <NewModalBody>{children}</NewModalBody>
      <Row className="justify-end space-x-1 px-5 pt-2 pb-4">
        <SimpleButton testId={testIds.closeButton} onClick={onClose}>
          {t('close')}
        </SimpleButton>
      </Row>
    </Modal>
  );
};
