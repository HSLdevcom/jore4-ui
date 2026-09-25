import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from '../../../common/Modals';
import { MoveDepotStopChanges } from './MoveDepotStop';

type EditDepotStopConfirmationDialogProps = {
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly editChanges: MoveDepotStopChanges;
  readonly isConfirming?: boolean;
};

export const EditDepotStopConfirmationDialog: FC<
  EditDepotStopConfirmationDialogProps
> = ({ onConfirm, onCancel, editChanges, isConfirming }) => {
  const { t } = useTranslation();

  return (
    <ConfirmationDialog
      isOpen
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={t(($) => $.confirmEditStopDialog.title)}
      description={t(($) => $.confirmEditStopDialog.description, {
        stopLabel: editChanges.depotStop.label,
      })}
      confirmText={t(($) => $.confirmEditStopDialog.confirmText)}
      cancelText={t(($) => $.cancel)}
      widthClassName="w-235"
      isConfirming={isConfirming}
    />
  );
};
