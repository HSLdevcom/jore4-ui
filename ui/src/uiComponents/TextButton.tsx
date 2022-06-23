import React from 'react';

type Props = {
  active?: boolean;
  onClick: () => void;
  className?: string;
};

export const TextButton: React.FC<Props> = ({
  active,
  onClick,
  children,
  className = '',
}): JSX.Element => (
  <button
    onClick={onClick}
    type="button"
    className={`${className || ''} active:underline ${
      active ? 'font-bold underline' : ''
    }`}
  >
    {children}
  </button>
);
