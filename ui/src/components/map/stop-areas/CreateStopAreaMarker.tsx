import noop from 'lodash/noop';
import React, { useCallback, useEffect } from 'react';
import { MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre';
import { useDispatch } from 'react-redux';
import { useCallbackOnKeyEscape } from '../../../hooks';
import {
  resetEnabledStopAreaModesAction,
  setSelectedMapStopAreaIdAction,
} from '../../../redux';
import { Coords } from '../../../types';
import { StopAreaMarker } from '../markers';

export const CreateStopAreaMarker = (): JSX.Element => {
  const [mouseCoords, setMouseCoords] = React.useState<Coords>();
  const dispatch = useDispatch();
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

  const resetModes = () => {
    dispatch(resetEnabledStopAreaModesAction());
    dispatch(setSelectedMapStopAreaIdAction(undefined));
  };

  useCallbackOnKeyEscape(resetModes);

  return (
    <>
      {mouseCoords && (
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
      )}
    </>
  );
};
