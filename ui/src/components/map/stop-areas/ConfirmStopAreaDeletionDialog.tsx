import React from 'react';
import { useTranslation } from 'react-i18next';
import { StopAreaByIdResult } from '../../../hooks';
import { ConfirmationDialog } from '../../../uiComponents';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
  stopArea: StopAreaByIdResult;
}

// renders a confirmation dialog for confirming changes when a stop is deleted
export const ConfirmStopAreaDeletionDialog: React.FC<Props> = ({
  isOpen,
  onConfirm,
  onCancel,
  className = '',
  stopArea,
}) => {
  const { t } = useTranslation();

  // TODO: list member stop labels.
  // TODO: stop labels should be bolded like in designs. This requires some rework on ConfirmationDialog.
  const memberStopCount = stopArea.members?.length ?? 0;
  const memberStopLabels: string[] = [];

  const confirmationTextParts: string[] = [
    t('confirmStopAreaDeletionDialog.description1', {
      stopCount: memberStopCount,
    }),
    '',
    memberStopLabels.join(', '),
    t('confirmStopAreaDeletionDialog.description2'),
  ];
  const description = confirmationTextParts.join('\n');

  return (
    <ConfirmationDialog
      className={className}
      widthClassName="max-w-md"
      isOpen={isOpen}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={t('confirmStopAreaDeletionDialog.title')}
      description={description}
      confirmText={t('confirmStopAreaDeletionDialog.confirmText')}
      cancelText={t('cancel')}
    />
  );
};
