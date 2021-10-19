import React from 'react';
import { Marker } from 'react-map-gl';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import { Point } from '../../types';
import { Pin } from './Pin';


interface Props extends Point {
  draggable?: boolean;
  onClick: () => void;
  onDragEnd: (event: CallbackEvent) => void;
}

export const Stop = ({
  latitude,
  longitude,
  onClick,
  onDragEnd,
  draggable = false,
}: Props): JSX.Element => {
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      offsetTop={-20}
      offsetLeft={-10}
      draggable={draggable}
      onDragEnd={onDragEnd}
    >
      <Pin size={40} onClick={onClick} />
    </Marker>
  );
};
