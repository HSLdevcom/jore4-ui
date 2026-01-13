import { DialogTitle } from '@headlessui/react';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../layoutComponents';
import { CloseIconButton } from '../CloseIconButton';

const testIds = {
  closeButton: 'ModalHeader::closeButton',
};

type NewModalHeaderProps = {
  readonly onClose: () => void;
  readonly heading: string;
  readonly className?: string;
};

export const NewModalHeader: FC<NewModalHeaderProps> = ({
  onClose,
  heading,
  className,
}) => {
  return (
    <Row
      className={twMerge(
        'flex justify-between border border-light-grey bg-background px-5 py-4',
        className,
      )}
    >
      <DialogTitle>{heading}</DialogTitle>
      <CloseIconButton onClick={onClose} testId={testIds.closeButton} />
    </Row>
  );
};
