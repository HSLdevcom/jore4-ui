import { FC, ReactNode } from 'react';
import { DialogWithButtons } from './DialogWithButtons';

const testIds = {
  cancelButton: 'ConfirmationDialog::cancelButton',
  confirmButton: 'ConfirmationDialog::confirmButton',
};

export type ConfirmationDialogProps = {
  readonly isOpen: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly title: ReactNode;
  readonly description: ReactNode;
  readonly confirmText: ReactNode;
  readonly cancelText: ReactNode;
  readonly className?: string;
  readonly widthClassName?: string;
};

export const ConfirmationDialog: FC<ConfirmationDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText,
  cancelText,
  className,
  widthClassName,
}) => {
  return (
    <DialogWithButtons
      isOpen={isOpen}
      title={title}
      description={description}
      buttons={[
        {
          text: cancelText,
          onClick: onCancel,
          inverted: true,
          testId: testIds.cancelButton,
        },
        {
          text: confirmText,
          onClick: onConfirm,
          testId: testIds.confirmButton,
        },
      ]}
      onCancel={onCancel}
      className={className}
      widthClassName={widthClassName}
    />
  );
};
