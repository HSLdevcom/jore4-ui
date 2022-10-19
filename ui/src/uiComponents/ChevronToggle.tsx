import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IconButton } from './IconButton';

type Props = {
  isToggled: boolean;
  testId?: string;
  onClick: () => void;
};

export const ChevronToggle = ({
  isToggled,
  onClick,
  testId,
}: Props): JSX.Element => {
  const iconClassName = 'text-3xl text-tweaked-brand';
  return (
    <IconButton
      onClick={onClick}
      icon={
        isToggled ? (
          <FaChevronUp className={iconClassName} />
        ) : (
          <FaChevronDown className={iconClassName} />
        )
      }
      testId={testId}
    />
  );
};
