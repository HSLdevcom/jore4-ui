import { Row } from '../../layoutComponents';
import { CloseIconButton } from '../../uiComponents';

interface Props {
  onClose: () => void;
  heading: string;
}

export const ModalHeader = ({ onClose, heading }: Props): JSX.Element => {
  return (
    <Row className="border border-light-grey bg-background px-14 py-7">
      <h2>{heading}</h2>
      <CloseIconButton className="ml-auto" onClick={onClose} />
    </Row>
  );
};
