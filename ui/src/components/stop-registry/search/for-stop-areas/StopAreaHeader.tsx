import { Geometry } from 'geojson';
import noop from 'lodash/noop';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import { Point } from '../../../../types';
import { LocatorButton } from '../../../../uiComponents';
import { mapLngLatToPoint } from '../../../../utils';
import { useShowStopAreaOnMap } from '../../utils';
import { FindStopAreaInfo } from './useFindStopAreas';

function centroidToPoint(centroid: Geometry | null | undefined): Point | null {
  if (centroid?.type === 'Point') {
    return mapLngLatToPoint(centroid.coordinates);
  }

  return null;
}

type StopAreaHeaderProps = {
  readonly className?: string;
  readonly stopArea: FindStopAreaInfo;
};

export const StopAreaHeader: FC<StopAreaHeaderProps> = ({
  className,
  stopArea,
}) => {
  const { t } = useTranslation();

  const showOnMap = useShowStopAreaOnMap();
  const point = centroidToPoint(stopArea.centroid);

  return (
    <div
      className={twMerge(
        'flex items-center gap-4 rounded-t-xl border-x border-t border-x-light-grey border-t-light-grey bg-background p-4',
        className,
      )}
    >
      <h3>
        {t('stopRegistrySearch.stopAreaLabel', {
          name: stopArea.name_value,
          description: stopArea.description_value,
        })}
      </h3>

      <div className="flex-grow" />

      <LocatorButton
        onClick={
          point ? () => showOnMap(stopArea.netex_id ?? undefined, point) : noop
        }
        tooltipText={t('stopRegistrySearch.showStopAreaOnMap')}
      />
    </div>
  );
};
