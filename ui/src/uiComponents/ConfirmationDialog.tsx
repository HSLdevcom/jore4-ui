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
  widthClassName?: string;
}

const testIds = {
  confirmButton: 'ConfirmationDialog::confirmButton',
};

export const ConfirmationDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText,
  cancelText,
  className = '',
  widthClassName = '',
}: Props): React.ReactElement => {
  return (
    <DialogWithButtons
      isOpen={isOpen}
      title={title}
      description={description}
      buttons={[
        { text: cancelText, onClick: onCancel, inverted: true },
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
