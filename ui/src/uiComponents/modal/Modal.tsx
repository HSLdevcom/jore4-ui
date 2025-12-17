import { Dialog } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type ModalProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly dialogClassName?: string;
  readonly contentClassName?: string;
  readonly testId?: string;
};

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  isOpen,
  onClose,
  dialogClassName,
  contentClassName,
  testId = null,
  children,
}) => {
  return (
    <Dialog
      open={isOpen}
      data-testid={testId}
      onClose={onClose}
      className={twMerge('relative z-40', dialogClassName)}
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
