import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Marker } from 'react-map-gl/maplibre';
import { Point } from '../../../types';
import { TerminalMarker } from '../markers';

const testIds = {
  placeholder: 'Map::MapTerminal::placeholder',
};

type NewTerminalMarkerProps = {
  readonly point: Point | null;
};

export const NewTerminalMarker: FC<NewTerminalMarkerProps> = ({ point }) => {
  const { t } = useTranslation();

  if (!point) {
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
