import React, { FC, ReactNode } from 'react';
import { CloseIconButton } from './CloseIconButton';

const testIds = {
  closeButton: 'Popover::closeButton',
};

type PopoverProps = {
  readonly className?: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
};

export const Popover: FC<PopoverProps> = ({
  children,
  onClose,
  className = '',
}) => {
  return (
    <div
      className={`absolute inline-flex flex-row items-start rounded-lg border border-hsl-highlight-yellow-dark bg-hsl-highlight-yellow-light p-3 ${className}`}
    >
      <div className="mr-6">{children}</div>
      <CloseIconButton onClick={onClose} testId={testIds.closeButton} />
    </div>
  );
};
