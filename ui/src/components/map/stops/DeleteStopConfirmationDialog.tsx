import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteChanges } from '../../../hooks';
import { ConfirmationDialog } from '../../../uiComponents';
import { buildRouteLabelListString } from './EditStopConfirmationDialog';

type DeleteStopConfirmationDialogProps = {
  readonly isOpen: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly className?: string;
  readonly deleteChanges: DeleteChanges;
};

// renders a confirmation dialog for confirming changes when a stop is deleted
export const DeleteStopConfirmationDialog: FC<
  DeleteStopConfirmationDialogProps
> = ({ isOpen, onConfirm, onCancel, className = '', deleteChanges }) => {
  const { t } = useTranslation();

  // TODO improve the confirmation dialog when Design has iterated on how this should look like
  const buildDescription = (changes: DeleteChanges) => {
    const deletedStopText = t('confirmDeleteStopDialog.description', {
      stopLabel: changes.deletedStopPoint.label,
    });
    const confirmationTextParts: string[] = [deletedStopText];

    // if stop is deleted from some routes, list them
    if (changes.deleteStopFromRoutes.length > 0) {
      const routeLabels = buildRouteLabelListString(
        changes.deleteStopFromRoutes,
        t,
      );
      const removedRoutesText = t('confirmDeleteStopDialog.removedFromRoutes', {
        routeLabels,
      });
      confirmationTextParts.push(removedRoutesText);
    }

    return confirmationTextParts.join('\n\n');
  };

  return (
    <ConfirmationDialog
      className={className}
      isOpen={isOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={t('confirmDeleteStopDialog.title')}
      description={buildDescription(deleteChanges)}
      confirmText={t('confirmDeleteStopDialog.confirmText')}
      cancelText={t('cancel')}
      widthClassName="w-235"
    />
  );
};
