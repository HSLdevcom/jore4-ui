import { Dialog } from '@headlessui/react';
import React from 'react';

type ModalPosition = 'default' | 'fullscreen';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  testId?: string;
  position?: ModalPosition;
}

const getPositionClassNames = (position: ModalPosition) => {
  switch (position) {
    case 'fullscreen':
      return 'left-0 top-0 absolute h-full w-full';
    default:
      return 'top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2';
  }
};

export const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  className = '',
  testId = null,
  children,
  position = 'default',
}) => {
  return (
    <Dialog
      open={isOpen}
      data-testid={testId}
      onClose={onClose}
      className={`${getPositionClassNames(
        position,
      )} fixed z-10 overflow-y-auto bg-white drop-shadow-md ${className}`}
    >
      {children}
    </Dialog>
  );
};
