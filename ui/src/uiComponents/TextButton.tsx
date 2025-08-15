import { FC, PropsWithChildren } from 'react';

type TextButtonProps = {
  readonly active?: boolean;
  readonly onClick: () => void;
  readonly className?: string;
};

export const TextButton: FC<PropsWithChildren<TextButtonProps>> = ({
  active,
  onClick,
  children,
  className = '',
}) => (
  <button
    onClick={onClick}
    type="button"
    className={`${className ?? ''} active:underline ${
      active ? 'font-bold underline' : ''
    }`}
  >
    {children}
  </button>
);
