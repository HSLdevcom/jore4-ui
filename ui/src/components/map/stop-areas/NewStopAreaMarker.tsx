import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Marker } from 'react-map-gl/maplibre';
import { Point } from '../../../types';
import { StopAreaMarker } from '../markers';

const testIds = {
  placeholder: 'Map::MapStopArea::placeholder',
};

type NewStopAreaMarker = {
  readonly point: Point | null;
};

export const NewStopAreaMarker: FC<NewStopAreaMarker> = ({ point }) => {
  const { t } = useTranslation();

  if (!point) {
    return null;
  }

  return (
    <Marker
      className="z-[1]"
      longitude={point.longitude}
      latitude={point.latitude}
    >
      <StopAreaMarker
        isPlaceholder
        testId={testIds.placeholder}
        title={t('stopArea.newStopArea')}
      />
    </Marker>
  );
};
