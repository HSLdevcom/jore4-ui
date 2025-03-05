import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { LocatorButton } from '../../../uiComponents';
import { LocatableStopWithObserveOnValidityStartProps } from '../types';
import { useShowStopOnMap } from '../utils/useShowStopOnMap';

export const LocatorActionButton: FC<
  LocatableStopWithObserveOnValidityStartProps
> = ({ className, observeOnStopValidityStartDate = false, stop }) => {
  const { t } = useTranslation();

  const openStopOnMap = useShowStopOnMap();

  return (
    <LocatorButton
      className={className}
      onClick={() => openStopOnMap(stop, observeOnStopValidityStartDate)}
      tooltipText={t('accessibility:common.showOnMap', {
        label: stop.label,
      })}
    />
  );
};
