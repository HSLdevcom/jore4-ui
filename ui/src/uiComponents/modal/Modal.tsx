import { Dialog } from '@headlessui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contentClassName?: string;
  testId?: string;
}

export const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  contentClassName = '',
  testId = null,
  children,
}) => {
  return (
    <Dialog
      open={isOpen}
      data-testid={testId}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div
          className={twMerge(
            'overflow-y-auto bg-white drop-shadow-md',
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </Dialog>
  );
};
