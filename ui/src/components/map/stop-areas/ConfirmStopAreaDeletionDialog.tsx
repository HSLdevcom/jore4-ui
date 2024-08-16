import isString from 'lodash/isString';
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

export const ConfirmStopAreaDeletionDialog: React.FC<Props> = ({
  isOpen,
  onConfirm,
  onCancel,
  className = '',
  stopArea,
}) => {
  const { t } = useTranslation();

  // TODO: stop labels should be bolded like in designs. This requires some rework on ConfirmationDialog.
  const memberStopLabels: string[] = (stopArea.members ?? [])
    .map((sp) => sp.scheduled_stop_point?.label)
    .filter(isString)
    .sort();

  const memberStopDescriptions = memberStopLabels.length
    ? [
        t('confirmStopAreaDeletionDialog.description1', {
          stopCount: memberStopLabels.length,
        }),
        '',
        memberStopLabels.join(', '),
      ]
    : [];

  const confirmationTextParts: string[] = [
    ...memberStopDescriptions,
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
