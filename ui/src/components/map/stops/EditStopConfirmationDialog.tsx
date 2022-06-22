import React from 'react';
import { useTranslation } from 'react-i18next';
import { EditChanges } from '../../../hooks';
import { ConfirmationDialog } from '../../../uiComponents';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
  editChanges: EditChanges;
}

/** Renders a confirmation dialog for confirming changes when a stop is edited */
export const EditStopConfirmationDialog: React.FC<Props> = ({
  isOpen,
  onConfirm,
  onCancel,
  className,
  editChanges,
}) => {
  const { t } = useTranslation();

  // TODO improve the confirmation dialog when Design has iterated on how this should look like
  const buildDescription = (changes: EditChanges) => {
    const editedStopText = t('confirmEditStopDialog.description', {
      stopLabel: changes.editedStop.label,
    });
    const confirmationTextParts: string[] = [editedStopText];

    // if stop is deleted from some routes, list them
    if (changes.deleteStopFromRoutes.length > 0) {
      const routeLabels = changes.deleteStopFromRoutes.map(
        (item) => item.label,
      );
      const removedRoutesText = t('confirmEditStopDialog.removedFromRoutes', {
        routeLabels,
      });
      confirmationTextParts.push(removedRoutesText);
    }

    return confirmationTextParts.join('<br/><br/>');
  };

  return (
    <ConfirmationDialog
      className={className}
      isOpen={isOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={t('confirmEditStopDialog.title')}
      description={buildDescription(editChanges)}
      confirmText={t('confirmEditStopDialog.confirmText')}
      cancelText={t('cancel')}
    />
  );
};
