import { Row } from '../../../layoutComponents';
import { CloseIconButton } from '../../../uiComponents';

const testIds = {
  closeButton: 'ModalHeader::closeButton',
};

interface Props {
  onClose: () => void;
  heading: string;
}

export const ModalHeader = ({
  onClose,
  heading,
}: Props): React.ReactElement => {
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
