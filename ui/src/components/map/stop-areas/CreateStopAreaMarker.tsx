import noop from 'lodash/noop';
import { FC, useCallback, useEffect, useState } from 'react';
import { MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre';
import { useCallbackOnKeyEscape } from '../../../hooks';
import { Coords } from '../../../types';
import { StopAreaMarker } from '../markers';

type CreateStopAreaMarkerProps = {
  readonly onCancel: () => void;
};

export const CreateStopAreaMarker: FC<CreateStopAreaMarkerProps> = ({
  onCancel,
}) => {
  const [mouseCoords, setMouseCoords] = useState<Coords>();
  const { current: map } = useMap();

  const CREATE_STOP_AREA_MARKER_SIZE = 20;

  // useCallback ensures that onMouseMove function is same
  // when calling map.on and map.off
  const onMouseMove = useCallback((e: MapLayerMouseEvent) => {
    setMouseCoords(e.point);
  }, []);

  useEffect(() => {
    map?.on('mousemove', onMouseMove);
    return () => {
      map?.off('mousemove', onMouseMove);
    };
  }, [map, onMouseMove]);

  useCallbackOnKeyEscape(onCancel);

  if (!mouseCoords) {
    return null;
  }

  return (
    <div
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        left: mouseCoords.x - CREATE_STOP_AREA_MARKER_SIZE / 2,
        top: mouseCoords.y - CREATE_STOP_AREA_MARKER_SIZE / 2,
      }}
    >
      <StopAreaMarker selected onClick={noop} />
    </div>
  );
};
