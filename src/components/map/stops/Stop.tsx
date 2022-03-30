import React from 'react';
import { Marker } from 'react-map-gl';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { Point } from '../../../types';
import { Circle } from '../markers';

const { colors } = theme;

interface Props extends Point {
  draggable?: boolean;
  selected?: boolean;
  onClick: () => void;
  onDragEnd: (event: CallbackEvent) => void;
  onVehicleRoute?: ReusableComponentsVehicleModeEnum;
}

export const Stop = ({
  latitude,
  longitude,
  onClick,
  onDragEnd,
  selected = false,
  draggable = false,
  onVehicleRoute = undefined,
}: Props): JSX.Element => {
  const iconSize = selected || onVehicleRoute ? 30 : 15;

  const iconBorderColor =
    selected && onVehicleRoute !== ReusableComponentsVehicleModeEnum.Bus
      ? 'black'
      : colors.stop;

  const iconBorderWidth = selected || onVehicleRoute ? 4 : 2;

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      offsetTop={-1 * (iconSize / 2)}
      offsetLeft={-1 * (iconSize / 2)}
      draggable={draggable}
      onDragEnd={onDragEnd}
    >
      <Circle
        size={iconSize}
        onClick={onClick}
        borderColor={iconBorderColor}
        borderWidth={iconBorderWidth}
        centerDot={!!onVehicleRoute}
      />
    </Marker>
  );
};
