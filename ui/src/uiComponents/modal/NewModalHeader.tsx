import { Dialog } from '@headlessui/react';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../layoutComponents';
import { CloseIconButton } from '../CloseIconButton';

const testIds = {
  closeButton: 'ModalHeader::closeButton',
};

interface Props {
  onClose: () => void;
  heading: string;
  className?: string;
}

export const NewModalHeader = ({
  onClose,
  heading,
  className = '',
}: Props): JSX.Element => {
  return (
    <Row
      className={twMerge(
        'flex justify-between border border-light-grey bg-background px-5 py-4',
        className,
      )}
    >
      <Dialog.Title>{heading}</Dialog.Title>
      <CloseIconButton onClick={onClose} testId={testIds.closeButton} />
    </Row>
  );
};
