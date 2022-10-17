import React from 'react';
import { CloseIconButton } from './CloseIconButton';

type Props = {
  className?: string;
  onClose: () => void;
};

export const Popover: React.FC<Props> = ({
  children,
  onClose,
  className = '',
}) => {
  return (
    <div
      className={`absolute inline-flex flex-row items-start rounded-lg border border-hsl-highlight-yellow-dark bg-hsl-highlight-yellow-light p-3 ${className}`}
    >
      <div className="mr-6">{children}</div>
      <CloseIconButton onClick={onClose} />
    </div>
  );
};
