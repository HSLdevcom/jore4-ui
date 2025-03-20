import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Row } from '../../../layoutComponents';
import { CloseIconButton } from '../../../uiComponents';

const testIds = {
  closeButton: 'ModalHeader::closeButton',
};

type ModalHeaderProps = {
  readonly className?: string;
  readonly onClose: () => void;
  readonly heading: ReactNode;
};

export const ModalHeader: FC<ModalHeaderProps> = ({
  className,
  onClose,
  heading,
}) => {
  return (
    <Row
      className={twMerge(
        'border border-light-grey bg-background px-10 py-7',
        className,
      )}
    >
      <h2>{heading}</h2>
      <CloseIconButton
        className="ml-auto"
        onClick={onClose}
        testId={testIds.closeButton}
      />
    </Row>
  );
};
