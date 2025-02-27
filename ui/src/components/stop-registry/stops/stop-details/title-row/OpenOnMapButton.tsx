import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopWithDetails } from '../../../../../hooks';
import { LocatorButton } from '../../../../../uiComponents';
import { mapLngLatToPoint } from '../../../../../utils';
import { useShowStopOnMap } from '../../../utils/useShowStopOnMap';

const testIds = {
  button: 'StopTitleRow::openOnMapButton',
};

type OpenOnMapButtonProps = {
  readonly className?: string;
  readonly label: string;
  readonly stop: StopWithDetails | null;
};

export const OpenOnMapButton: FC<OpenOnMapButtonProps> = ({
  className,
  label,
  stop,
}) => {
  const { t } = useTranslation();

  const openStopOnMap = useShowStopOnMap();
  const onClick = () => {
    if (stop && stop.stop_place !== null) {
      openStopOnMap({
        label: stop.label,
        netextId: stop.stop_place_ref ?? null,
        location: mapLngLatToPoint(stop.measured_location.coordinates),
      });
    }
  };

  return (
    <LocatorButton
      className={twMerge('h-11 w-11', className)}
      disabled={!stop}
      onClick={onClick}
      testId={testIds.button}
      tooltipText={t('accessibility:common.showOnMap', { label })}
    />
  );
};
