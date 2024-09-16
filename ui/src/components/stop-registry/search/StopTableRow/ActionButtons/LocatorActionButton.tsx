import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LocatorButton } from '../../../../../uiComponents';
import { StopRowTdProps } from '../StopRowTdProps';
import { useOpenStopOnMap } from '../utils';

export const LocatorActionButton: FC<StopRowTdProps> = ({
  className,
  stop,
}) => {
  const { t } = useTranslation();

  const openStopOnMap = useOpenStopOnMap();

  return (
    <LocatorButton
      className={className}
      onClick={() => openStopOnMap(stop)}
      tooltipText={t('accessibility:common.showOnMap', {
        label: stop.label,
      })}
    />
  );
};
