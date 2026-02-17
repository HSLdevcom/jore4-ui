import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Marker } from 'react-map-gl/maplibre';
import { EnrichedStopPlace } from '../../../types';
import { getGeometryPoint } from '../../../utils';
import { mapTransportModeToColor } from '../../../utils/colors';
import { StopAreaMarker } from '../markers';

const testIds = {
  placeholder: 'Map::MapStopArea::placeholder',
};

type NewStopAreaMarker = {
  readonly editedArea: EnrichedStopPlace;
};

export const NewStopAreaMarker: FC<NewStopAreaMarker> = ({ editedArea }) => {
  const { t } = useTranslation();

  const point = getGeometryPoint(editedArea.geometry);
  if (editedArea.id || !point) {
    return null;
  }

  const color = mapTransportModeToColor(editedArea.transportMode);

  return (
    <Marker
      className="z-1"
      longitude={point.longitude}
      latitude={point.latitude}
    >
      <StopAreaMarker
        isPlaceholder
        testId={testIds.placeholder}
        title={t('stopArea.newStopArea')}
        color={color}
      />
    </Marker>
  );
};
