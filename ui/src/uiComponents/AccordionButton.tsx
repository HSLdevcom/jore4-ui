import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IconButton } from './IconButton';

interface Props {
  testId: string;
  onToggle: (isOpen: boolean) => void;
  isOpen: boolean;
  className?: string;
}

export const AccordionButton = ({
  testId,
  onToggle,
  isOpen,
  className = '',
}: Props) => {
  return (
    <IconButton
      testId={testId}
      onClick={() => onToggle(!isOpen)}
      icon={
        isOpen ? (
          <FaChevronUp className="text-3xl text-tweaked-brand" />
        ) : (
          <FaChevronDown className="text-3xl text-tweaked-brand" />
        )
      }
      className={className}
    />
  );
};
