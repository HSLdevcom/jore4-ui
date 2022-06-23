import { Dialog } from '@headlessui/react';
import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  className = '',
  children,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className={`bg-white ${className || ''}`}
    >
      {children}
    </Dialog>
  );
};
