import { MdClose, MdEdit } from 'react-icons/md';
import { Visible } from '../layoutComponents';
import { IconButton } from './IconButton';

interface Props {
  title: string;
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
  title,
  showEdit,
  onEdit,
  onClose,
  testId,
}: Props): JSX.Element => {
  return (
    <div>
      <Visible visible={!showEdit}>
        <IconButton
          title={title}
          // title={t('accessibility:button.timetables.substituteDayEdit')}
          className="text-base font-bold text-brand"
          icon={<MdClose aria-hidden />}
          onClick={onClose}
          testId={testId}
        />
      </Visible>
      <Visible visible={showEdit}>
        <IconButton
          title={title}
          // title={t('accessibility:button.timetables.substituteDayEdit')}
          className="text-base font-bold text-brand"
          icon={<MdEdit aria-hidden />}
          onClick={onEdit}
          testId={testId}
        />
      </Visible>
    </div>
  );
};
