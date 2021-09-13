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
  className,
  children,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className={`absolute z-10 left-0 top-0 w-full h-full bg-background ${className}`}
    >
      {children}
    </Dialog>
  );
};
