import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmationDialog } from '../../common/Modals';
import { buildRouteLabelListString } from './EditStopConfirmationDialog';
import { DeleteChanges } from './hooks';

type DeleteStopConfirmationDialogProps = {
  readonly isOpen: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly className?: string;
  readonly deleteChanges: DeleteChanges;
  readonly isConfirming?: boolean;
};

// renders a confirmation dialog for confirming changes when a stop is deleted
export const DeleteStopConfirmationDialog: FC<
  DeleteStopConfirmationDialogProps
> = ({
  isOpen,
  onConfirm,
  onCancel,
  className,
  deleteChanges,
  isConfirming,
}) => {
  const { t } = useTranslation();

  // TODO improve the confirmation dialog when Design has iterated on how this should look like
  const buildDescription = (changes: DeleteChanges) => {
    const deletedStopText = t(($) => $.confirmDeleteStopDialog.description, {
      stopLabel: changes.deletedStopPoint.label,
    });

    // If stop is deleted from some routes, list them, else don't
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
      className={className}
      isOpen={isOpen}
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
