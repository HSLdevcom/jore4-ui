import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type TextButtonProps = {
  readonly active?: boolean;
  readonly onClick: () => void;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly testId?: string;
  readonly ariaLabel?: string;
  readonly title?: string;
};

export const TextButton: FC<PropsWithChildren<TextButtonProps>> = ({
  active,
  onClick,
  children,
  className,
  disabled,
  testId,
  ariaLabel,
  title,
}) => (
  <button
    onClick={onClick}
    type="button"
    disabled={disabled}
    data-testid={testId}
    aria-label={ariaLabel}
    title={title}
    className={twMerge(
      'active:underline disabled:cursor-not-allowed disabled:opacity-50',
      active ? 'font-bold underline' : '',
      className,
    )}
  >
    {children}
  </button>
);
