import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type TextButtonProps = {
  readonly active?: boolean;
  readonly onClick: () => void;
  readonly className?: string;
};

export const TextButton: FC<PropsWithChildren<TextButtonProps>> = ({
  active,
  onClick,
  children,
  className,
}) => (
  <button
    onClick={onClick}
    type="button"
    className={twMerge(
      'cursor-pointer active:underline',
      active ? 'font-bold underline' : '',
      className,
    )}
  >
    {children}
  </button>
);
