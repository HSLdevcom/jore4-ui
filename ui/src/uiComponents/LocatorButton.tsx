import { FC } from 'react';
import { MdPinDrop } from 'react-icons/md';
import { twMerge } from 'tailwind-merge';
import { IconButton } from './IconButton';
import { getHoverStyles } from './SimpleButton';

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
        `h-10 w-10`,
        `rounded-full border border-grey`,
        `bg-white text-tweaked-brand`,
        getHoverStyles(false, disabled),
        'disabled:pointer-events-none disabled:bg-background disabled:opacity-70',
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
