import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LocatorButton } from '../../../uiComponents';
import { LocatableStopProps } from '../types';
import { useShowStopOnMap } from '../utils/useShowStopOnMap';

export const LocatorActionButton: FC<LocatableStopProps> = ({
  className,
  stop,
}) => {
  const { t } = useTranslation();

  const openStopOnMap = useShowStopOnMap();

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
