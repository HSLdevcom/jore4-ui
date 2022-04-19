import { Dialog } from '@headlessui/react';
import React from 'react';
import { CloseIconButton } from './CloseIconButton';
import { SimpleButton } from './SimpleButton';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  className?: string;
}

export const ConfirmationDialog: React.FC<Props> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText,
  cancelText,
  className,
}) => {
  const descHtml = { __html: description };
  return (
    <Dialog
      as="div"
      open={isOpen}
      onClose={onCancel}
      className={`fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-50 ${className}`}
    >
      <div className="flex h-full items-center justify-center">
        <div className="w-full max-w-sm rounded-md bg-white p-5 shadow-md">
          <div className="flex">
            <div className="text-xl font-bold">{title}</div>
            <CloseIconButton className="ml-auto" onClick={onCancel} />
          </div>

          {/* eslint-disable-next-line react/no-danger */}
          <p className="my-5 text-base" dangerouslySetInnerHTML={descHtml} />
          <div className="flex justify-end space-x-5">
            <SimpleButton inverted onClick={onCancel}>
              {cancelText}
            </SimpleButton>
            <SimpleButton onClick={onConfirm}>{confirmText}</SimpleButton>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
