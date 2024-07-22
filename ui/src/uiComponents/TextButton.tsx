import React, { FC, ReactNode } from 'react';

type Props = {
  active?: boolean;
  onClick: () => void;
  className?: string;
  children: ReactNode;
};

export const TextButton: FC<Props> = ({
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
