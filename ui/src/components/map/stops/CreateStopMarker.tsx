import debounce from 'lodash/debounce';
import { Point as MapLibrePoint } from 'maplibre-gl';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre';
import { useCallbackOnKeyEscape } from '../../../hooks';
import {
  drawLineToClosestRoad,
  removeLineFromStopToInfraLink,
} from '../../../utils/map';
import { LineToActiveStopArea } from './LineToActiveStopArea';

type CreateStopMarkerProps = {
  readonly onCancel: () => void;
};

export const CreateStopMarker: FC<CreateStopMarkerProps> = ({ onCancel }) => {
  const [mouseCoords, setMouseCoords] = useState<MapLibrePoint | null>(null);

  const { current: map } = useMap();

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
          left: mouseCoords.x - 20.5,
          top: mouseCoords.y - 20.5,
        }}
      >
        <svg
          width="41"
          height="41"
          viewBox="0 0 41 41"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 0.199219V15.1992" stroke="black" strokeWidth="2" />
          <path d="M20 25.1992V40.1992" stroke="black" strokeWidth="2" />
          <path
            d="M15.0527 20.1992H-0.000185966"
            stroke="black"
            strokeWidth="2"
          />
          <path d="M40.0527 20.1992H24.9998" stroke="black" strokeWidth="2" />
          <circle cx="20" cy="20.1992" r="2.5" fill="black" />
        </svg>
      </div>
    </>
  );
};
