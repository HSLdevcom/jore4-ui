import { FC } from 'react';
import { MdPinDrop } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { IconButton } from './IconButton';

const testIds = {
  button: 'LocatorButton::button',
};

type LocatorButtonProps = {
  readonly testId?: string;
  readonly disabled?: boolean;
  readonly onClick: () => void;
  readonly className?: string;
  readonly tooltipText: string;
};

export const LocatorButton: FC<LocatorButtonProps> = ({
  testId,
  onClick,
  disabled,
  className,
  tooltipText,
}) => {
  return (
    <IconButton
      className={twMerge(
        'h-10 w-10',
        'rounded-full border border-grey',
        'bg-white text-tweaked-brand',
        'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
        'hover:enabled:border-tweaked-brand enabled:hover:outline-tweaked-brand',
        className,
      )}
      tooltip={tooltipText}
      onClick={onClick}
      disabled={disabled}
      icon={<MdPinDrop className="text-2xl" aria-hidden />}
      testId={testId ?? testIds.button}
    />
  );
};
