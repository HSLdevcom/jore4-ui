import { FC } from 'react';
import { MdClose, MdEdit } from 'react-icons/md';
import { IconButton } from '../../../common/Buttons';
import { Visible } from '../../../common/LayoutComponents';

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
          className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-full text-brand hover:bg-background-hover-grey"
          icon={<MdClose size={18} aria-hidden />}
          onClick={onClose}
          testId={testId}
        />
      </Visible>
      <Visible visible={showEdit}>
        <IconButton
          tooltip={titleEdit}
          className="inline-flex h-7.5 w-7.5 items-center justify-center rounded-full text-brand hover:bg-background-hover-grey"
          icon={<MdEdit size={18} aria-hidden />}
          onClick={onEdit}
          testId={testId}
        />
      </Visible>
    </div>
  );
};
