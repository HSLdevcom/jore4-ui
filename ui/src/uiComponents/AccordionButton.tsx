import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { IconButton } from './IconButton';

interface Props {
  testId: string;
  onToggle: (isOpen: boolean) => void;
  isOpen: boolean;
  className?: string;
  iconClassName?: string;
}

export const AccordionButton = ({
  testId,
  onToggle,
  isOpen,
  className = '',
  iconClassName = '',
}: Props) => {
  return (
    <IconButton
      testId={testId}
      onClick={() => onToggle(!isOpen)}
      icon={
        isOpen ? (
          <MdKeyboardArrowUp
            className={`${iconClassName} text-3xl text-tweaked-brand`}
          />
        ) : (
          <MdKeyboardArrowDown
            className={`${iconClassName} text-3xl text-tweaked-brand`}
          />
        )
      }
      className={className}
    />
  );
};
