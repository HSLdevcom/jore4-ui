import { FC } from 'react';
import { MdClose, MdEdit } from 'react-icons/md';
import { Visible } from '../layoutComponents';
import { IconButton } from './IconButton';

type EditCloseButtonProps = {
  readonly titleEdit: string;
  readonly titleClose: string;
  readonly showEdit: boolean;
  readonly onEdit: () => void;
  readonly onClose: () => void;
  readonly testId: string;
};

/**
 * showEdit controls which option is rendered.
 *
 * When showEdit is set to true, renders the edit option
 * otherwise renders the close option
 */
export const EditCloseButton: FC<EditCloseButtonProps> = ({
  titleEdit,
  titleClose,
  showEdit,
  onEdit,
  onClose,
  testId,
}) => {
  return (
    <div>
      <Visible visible={!showEdit}>
        <IconButton
          tooltip={titleClose}
          className="text-base font-bold text-brand"
          icon={<MdClose aria-hidden />}
          onClick={onClose}
          testId={testId}
        />
      </Visible>
      <Visible visible={showEdit}>
        <IconButton
          tooltip={titleEdit}
          className="text-base font-bold text-brand"
          icon={<MdEdit aria-hidden />}
          onClick={onEdit}
          testId={testId}
        />
      </Visible>
    </div>
  );
};
