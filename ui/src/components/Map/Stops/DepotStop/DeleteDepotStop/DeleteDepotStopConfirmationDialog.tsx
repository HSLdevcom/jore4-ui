import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from '../../../../common/Modals';
import { buildRouteLabelListString } from '../../EditStopConfirmationDialog';
import { DeleteDepotStopChanges } from './useDeleteDepotStop';

type DeleteDepotStopConfirmationDialogProps = {
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly deleteChanges: DeleteDepotStopChanges;
  readonly isConfirming?: boolean;
};

export const DeleteDepotStopConfirmationDialog: FC<
  DeleteDepotStopConfirmationDialogProps
> = ({ onConfirm, onCancel, deleteChanges, isConfirming }) => {
  const { t } = useTranslation();

  const buildDescription = (changes: DeleteDepotStopChanges) => {
    const deletedStopText = t(($) => $.confirmDeleteStopDialog.description, {
      stopLabel: changes.depotStop.label,
    });

    if (changes.deleteStopFromRoutes.length === 0) {
      return deletedStopText;
    }

    const removedRoutesText = t(
      ($) => $.confirmDeleteStopDialog.removedFromRoutes,
      {
        routeLabels: buildRouteLabelListString(changes.deleteStopFromRoutes, t),
      },
    );

    return `${deletedStopText}\n\n${removedRoutesText}`;
  };

  return (
    <ConfirmationDialog
      isOpen
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={t(($) => $.confirmDeleteStopDialog.title)}
      description={buildDescription(deleteChanges)}
      confirmText={t(($) => $.confirmDeleteStopDialog.confirmText)}
      cancelText={t(($) => $.cancel)}
      widthClassName="w-235"
      isConfirming={isConfirming}
    />
  );
};
