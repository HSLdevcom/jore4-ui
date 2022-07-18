import { Dialog } from '@headlessui/react';
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  testId?: string;
}

export const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  className = '',
  testId = null,
  children,
}) => {
  return (
    <Dialog
      open={isOpen}
      data-testid={testId}
      onClose={onClose}
      className={`bg-white ${className || ''}`}
    >
      {children}
    </Dialog>
  );
};
