import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from '../../../../common/Modals';
import { MapDepotStop } from '../../../Types';

type DeleteDepotStopConfirmationDialogProps = {
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly depotStop: MapDepotStop;
  readonly isConfirming?: boolean;
};

export const DeleteDepotStopConfirmationDialog: FC<
  DeleteDepotStopConfirmationDialogProps
> = ({ onConfirm, onCancel, depotStop, isConfirming }) => {
  const { t } = useTranslation();

  return (
    <ConfirmationDialog
      isOpen
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={t(($) => $.confirmDeleteStopDialog.title)}
      description={t(($) => $.confirmDeleteStopDialog.description, {
        stopLabel: depotStop.label,
      })}
      confirmText={t(($) => $.confirmDeleteStopDialog.confirmText)}
      cancelText={t(($) => $.cancel)}
      isConfirming={isConfirming}
    />
  );
};
