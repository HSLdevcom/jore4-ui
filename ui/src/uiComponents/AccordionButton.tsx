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
            className={`text-3xl text-tweaked-brand ${iconClassName}`}
          />
        ) : (
          <MdKeyboardArrowDown
            className={`text-3xl text-tweaked-brand ${iconClassName} `}
          />
        )
      }
      className={className}
    />
  );
};
