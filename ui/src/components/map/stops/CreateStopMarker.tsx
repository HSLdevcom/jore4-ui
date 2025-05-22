import debounce from 'lodash/debounce';
import { Point as MapLibrePoint } from 'maplibre-gl';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre';
import { theme } from '../../../generated/theme';
import { useCallbackOnKeyEscape } from '../../../hooks';
import {
  drawLineToClosestRoad,
  removeLineFromStopToInfraLink,
} from '../../../utils/map';
import { Circle } from '../markers';
import { LineToActiveStopArea } from './LineToActiveStopArea';

const { colors } = theme;

type CreateStopMarkerProps = {
  readonly onCancel: () => void;
};

export const CreateStopMarker: FC<CreateStopMarkerProps> = ({ onCancel }) => {
  const [mouseCoords, setMouseCoords] = useState<MapLibrePoint | null>(null);

  const { current: map } = useMap();

  const createStopMarkerSize = 20;

  // Without debounce when drawing line from infralink to stop
  // map tries to draw a line atleast every 0.01ms
  // This makes the drawn line to lag behind
  const debouncedDrawLineToClosestRoad = useMemo(
    () => debounce(drawLineToClosestRoad, 1),
    [],
  );

  // useCallback ensures that onMouseMove function is same
  // when calling map.on and map.off
  const onMouseMove = useCallback(
    (e: MapLayerMouseEvent) => {
      setMouseCoords(e.point);
      debouncedDrawLineToClosestRoad(map?.getMap(), e.point);
    },
    [debouncedDrawLineToClosestRoad, map],
  );

  useEffect(() => {
    map?.on('mousemove', onMouseMove);
    return () => {
      map?.off('mousemove', onMouseMove);
      removeLineFromStopToInfraLink(map?.getMap());
    };
  }, [map, onMouseMove]);

  useCallbackOnKeyEscape(onCancel);

  if (!mouseCoords) {
    return null;
  }

  /* Display hovering bus stop while in create mode */
  return (
    <>
      <LineToActiveStopArea.FromMouse mouseCoords={mouseCoords} />

      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          left: mouseCoords.x - createStopMarkerSize / 2,
          top: mouseCoords.y - createStopMarkerSize / 2,
        }}
      >
        <Circle
          centerDot
          borderColor={colors.hslRed}
          size={createStopMarkerSize}
        />
      </div>
    </>
  );
};
