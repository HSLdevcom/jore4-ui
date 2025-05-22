import { FC } from 'react';
import { Row } from '../../layoutComponents';
import { CloseIconButton } from '../CloseIconButton';

const testIds = {
  closeButton: 'ModalHeader::closeButton',
};

type ModalHeaderProps = {
  readonly onClose: () => void;
  readonly heading: string;
};

export const ModalHeader: FC<ModalHeaderProps> = ({ onClose, heading }) => {
  return (
    <Row className="border border-light-grey bg-background px-10 py-7">
      <h2>{heading}</h2>
      <CloseIconButton
        className="ml-auto"
        onClick={onClose}
        testId={testIds.closeButton}
      />
    </Row>
  );
};
