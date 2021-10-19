import React from 'react';
import { Marker } from 'react-map-gl';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import { theme } from '../../generated/theme';
import { Point } from '../../types';
import { Circle } from './Circle';

const { colors } = theme;

interface Props extends Point {
  draggable?: boolean;
  selected?: boolean;
  onClick: () => void;
  onDragEnd: (event: CallbackEvent) => void;
}

export const Stop = ({
  latitude,
  longitude,
  onClick,
  onDragEnd,
  selected = false,
  draggable = false,
}: Props): JSX.Element => {
  const iconSize = selected ? 30 : 15;
  const iconBorderColor = selected ? 'black' : colors.stop;
  const iconBorderWidth = selected ? 4 : 2;
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      offsetTop={-8}
      offsetLeft={-10}
      draggable={draggable}
      onDragEnd={onDragEnd}
    >
      <Circle
        size={iconSize}
        onClick={onClick}
        borderColor={iconBorderColor}
        borderWidth={iconBorderWidth}
      />
    </Marker>
  );
};
