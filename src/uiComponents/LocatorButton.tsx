import { MdPinDrop } from 'react-icons/md';
import { IconButton } from './IconButton';

interface Props {
  testId?: string;
  onClick: () => void;
  className?: string;
}

const hoverStyle = 'hover:border-2 hover:border-tweaked-brand';

export const LocatorButton = ({ testId, onClick, className = '' }: Props) => {
  return (
    <IconButton
      className={`h-10 w-10 rounded-full border border-grey bg-white text-tweaked-brand ${hoverStyle} ${className}`}
      onClick={onClick}
      icon={<MdPinDrop className="text-2xl" />}
      testId={testId || 'locator-button'}
    />
  );
};
