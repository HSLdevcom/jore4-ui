import noop from 'lodash/noop';
import { FC, useEffect, useState } from 'react';
import { MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre';
import { useCallbackOnKeyEscape } from '../../../hooks';
import { Coords } from '../../../types';
import { TerminalMarker } from '../markers';

type CreateTerminalMarkerProps = {
  readonly onCancel: () => void;
};

export const CreateTerminalMarker: FC<CreateTerminalMarkerProps> = ({
  onCancel,
}) => {
  const [mouseCoords, setMouseCoords] = useState<Coords>();
  const { current: map } = useMap();

  const CREATE_TERMINAL_MARKER_SIZE = 20;

  useEffect(() => {
    // useCallback ensures that onMouseMove function is same
    // when calling map.on and map.off
    const onMouseMove = (e: MapLayerMouseEvent) => {
      setMouseCoords(e.point);
    };

    map?.on('mousemove', onMouseMove);
    return () => {
      map?.off('mousemove', onMouseMove);
    };
  }, [map]);

  useCallbackOnKeyEscape(onCancel);

  return (
    <>
      {mouseCoords && (
        <div
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            left: mouseCoords.x - CREATE_TERMINAL_MARKER_SIZE / 2,
            top: mouseCoords.y - CREATE_TERMINAL_MARKER_SIZE / 2,
          }}
        >
          <TerminalMarker selected onClick={noop} />
        </div>
      )}
    </>
  );
};
