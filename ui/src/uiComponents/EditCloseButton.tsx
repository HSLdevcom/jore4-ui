import { MdClose, MdEdit } from 'react-icons/md';
import { Visible } from '../layoutComponents';
import { IconButton } from './IconButton';

interface Props {
  showEdit: boolean;
  onEdit: () => void;
  onClose: () => void;
  testId: string;
}

/**
 * showEdit controls which option is rendered.
 *
 * When showEdit is set to true, renders the edit option
 * otherwise renders the close option
 */
export const EditCloseButton = ({
  showEdit,
  onEdit,
  onClose,
  testId,
}: Props): JSX.Element => {
  return (
    <div>
      <Visible visible={!showEdit}>
        <IconButton
          className="text-base font-bold text-brand"
          icon={<MdClose />}
          onClick={onClose}
          testId={testId}
        />
      </Visible>
      <Visible visible={showEdit}>
        <IconButton
          className="text-base font-bold text-brand"
          icon={<MdEdit />}
          onClick={onEdit}
          testId={testId}
        />
      </Visible>
    </div>
  );
};
