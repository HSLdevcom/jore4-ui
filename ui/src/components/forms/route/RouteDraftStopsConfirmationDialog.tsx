import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogWithButtons } from '../../../uiComponents';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onRemoveStops: () => void;
  onCancel: () => void;
  routeLabel?: string;
  stopsLabelsToRemove: string[];
  className?: string;
}

export const RouteDraftStopsConfirmationDialog = ({
  isOpen,
  onConfirm,
  onRemoveStops,
  onCancel,
  routeLabel,
  stopsLabelsToRemove,
  className = '',
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <DialogWithButtons
      isOpen={isOpen}
      title={t('confirmRouteDraftStopsDialog.title')}
      description={t('confirmRouteDraftStopsDialog.description', {
        routeLabel,
        stopLabels: stopsLabelsToRemove.join(', '),
      })}
      buttons={[
        { onClick: onCancel, text: t('cancel'), inverted: true },
        {
          onClick: onRemoveStops,
          text: t('confirmRouteDraftStopsDialog.removeStopsText'),
        },
        {
          onClick: onConfirm,
          text: t('confirmRouteDraftStopsDialog.confirmText'),
        },
      ]}
      onCancel={onCancel}
      className={className}
      isWide
    />
  );
};
