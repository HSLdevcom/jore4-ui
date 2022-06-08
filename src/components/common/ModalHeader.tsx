import { Row } from '../../layoutComponents';
import { CloseIconButton } from '../../uiComponents';

interface HeaderProps {
  onClose: () => void;
  heading: string;
}

export const ModalHeader = ({ onClose, heading }: HeaderProps): JSX.Element => {
  return (
    <div className="border border-light-grey bg-background px-14 py-7">
      <Row>
        <p className="text-2xl font-bold">{heading}</p>
        <CloseIconButton className="ml-auto" onClick={onClose} />
      </Row>
    </div>
  );
};
