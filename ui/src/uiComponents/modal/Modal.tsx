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
      className={`fixed top-1/2 left-1/2 z-10 -translate-y-1/2 -translate-x-1/2 overflow-y-auto bg-white drop-shadow-md ${className}`}
    >
      {children}
    </Dialog>
  );
};
