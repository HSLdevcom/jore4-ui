import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from '../../../uiComponents';

type CopyStopConfirmationDialogProps = {
  readonly isOpen: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly className?: string;
};
export const CopyStopConfirmationDialog: FC<
  CopyStopConfirmationDialogProps
> = ({ isOpen, onConfirm, onCancel, className }) => {
  const { t } = useTranslation();

  return (
    <ConfirmationDialog
      className={className}
      isOpen={isOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={t('confirmStopCopyDialog.title')}
      description={t('confirmStopCopyDialog.description')}
      confirmText={t('confirmStopCopyDialog.confirmText')}
      cancelText={t('cancel')}
      widthClassName="w-235"
    />
  );
};
