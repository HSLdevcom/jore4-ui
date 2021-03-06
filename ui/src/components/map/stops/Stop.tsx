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
  onDragEnd?: (event: CallbackEvent) => void;
  onVehicleRoute?: ReusableComponentsVehicleModeEnum;
  isHighlighted?: boolean;
}

export const Stop = ({
  latitude,
  longitude,
  onClick,
  onDragEnd,
  selected = false,
  draggable = false,
  onVehicleRoute = undefined,
  isHighlighted = false,
}: Props): JSX.Element => {
  const iconSize = 30;

  const vehicleStopColor = onVehicleRoute
    ? colors.stops[onVehicleRoute]
    : 'black';

  const iconBorderColor = isHighlighted
    ? colors.selectedMapItem
    : vehicleStopColor;
  const iconFillColor = onVehicleRoute ? 'white' : colors.lightGrey;

  const iconBorderWidth = 4;

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
        fillColor={iconFillColor}
        borderWidth={iconBorderWidth}
        centerDot={selected}
      />
    </Marker>
  );
};
