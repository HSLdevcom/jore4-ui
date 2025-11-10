import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { StopWithDetails } from '../../../../../types';
import { LocatorButton } from '../../../../../uiComponents';
import { getGeometryPoint } from '../../../../../utils';
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
    if (stop?.quay) {
      const location = getGeometryPoint(stop.quay.geometry);

      if (stop.quay.id && location) {
        openStopOnMap({
          label: stop.label,
          netexId: stop.quay.id,
          location,
        });
      }
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
