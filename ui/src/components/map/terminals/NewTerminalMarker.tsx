import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Marker } from 'react-map-gl/maplibre';
import { EnrichedParentStopPlace } from '../../../types';
import { getGeometryPoint } from '../../../utils';
import { TerminalMarker } from '../markers';

const testIds = {
  placeholder: 'Map::MapTerminal::placeholder',
};

type NewTerminalMarkerProps = {
  readonly editedTerminal: EnrichedParentStopPlace;
};

export const NewTerminalMarker: FC<NewTerminalMarkerProps> = ({
  editedTerminal,
}) => {
  const { t } = useTranslation();

  const point = getGeometryPoint(editedTerminal.geometry);
  if (editedTerminal.id || !point) {
    return null;
  }

  return (
    <Marker
      className="z-[2]"
      longitude={point.longitude}
      latitude={point.latitude}
    >
      <TerminalMarker
        isPlaceholder
        testId={testIds.placeholder}
        title={t('terminal.newTerminal')}
      />
    </Marker>
  );
};
