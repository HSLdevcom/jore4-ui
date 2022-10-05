import React from 'react';
import { DialogWithButtons } from './DialogWithButtons';

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
  className = '',
}) => {
  return (
    <DialogWithButtons
      isOpen={isOpen}
      title={title}
      description={description}
      buttons={[
        { onAction: onCancel, text: cancelText, inverted: true },
        { onAction: onConfirm, text: confirmText },
      ]}
      onCancel={onCancel}
      className={className}
      innerClassName="max-w-sm"
    />
  );
};
