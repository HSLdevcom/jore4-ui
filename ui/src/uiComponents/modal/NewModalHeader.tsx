import { Dialog } from '@headlessui/react';
import { Row } from '../../layoutComponents';
import { CloseIconButton } from '../CloseIconButton';

const testIds = {
  closeButton: 'ModalHeader::closeButton',
};

interface Props {
  onClose: () => void;
  heading: string;
}

export const NewModalHeader = ({ onClose, heading }: Props): JSX.Element => {
  return (
    <Row className="flex justify-between border border-light-grey bg-background px-5 py-4">
      <Dialog.Title>{heading}</Dialog.Title>
      <CloseIconButton onClick={onClose} testId={testIds.closeButton} />
    </Row>
  );
};
