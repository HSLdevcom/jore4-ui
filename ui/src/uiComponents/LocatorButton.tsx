import { MdPinDrop } from 'react-icons/md';
import { IconButton } from './IconButton';
import { commonHoverStyle } from './SimpleButton';

interface Props {
  testId?: string;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

export const LocatorButton = ({
  testId,
  onClick,
  disabled,
  className = '',
}: Props) => {
  const disabledStyle = '!bg-background opacity-70 pointer-events-none';
  return (
    <IconButton
      className={`h-10 w-10 rounded-full border border-grey bg-white text-tweaked-brand ${commonHoverStyle} ${
        disabled ? disabledStyle : ''
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
      icon={<MdPinDrop className="text-2xl" />}
      testId={testId || 'locator-button'}
    />
  );
};
