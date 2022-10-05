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

export const RouteDraftStopsConfirmationDialog: React.FC<Props> = ({
  isOpen,
  onConfirm,
  onRemoveStops,
  onCancel,
  routeLabel,
  stopsLabelsToRemove,
  className = '',
}) => {
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
        { onAction: onCancel, text: t('cancel'), inverted: true },
        {
          onAction: onRemoveStops,
          text: t('confirmRouteDraftStopsDialog.removeStopsText'),
        },
        {
          onAction: onConfirm,
          text: t('confirmRouteDraftStopsDialog.confirmText'),
        },
      ]}
      onCancel={onCancel}
      className={className}
      innerClassName="max-w-2xl"
    />
  );
};
