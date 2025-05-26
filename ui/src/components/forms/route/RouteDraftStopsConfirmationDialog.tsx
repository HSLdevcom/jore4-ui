import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogWithButtons } from '../../../uiComponents';

type RouteDraftStopsConfirmationDialogProps = {
  readonly isOpen: boolean;
  readonly onConfirm: () => void;
  readonly onRemoveStops: () => void;
  readonly onCancel: () => void;
  readonly routeLabel?: string;
  readonly stopsLabelsToRemove: ReadonlyArray<string>;
  readonly className?: string;
};

export const RouteDraftStopsConfirmationDialog: FC<
  RouteDraftStopsConfirmationDialogProps
> = ({
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
      widthClassName="max-w-2xl"
    />
  );
};
