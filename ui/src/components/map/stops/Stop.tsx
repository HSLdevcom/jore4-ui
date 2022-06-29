import { Marker, MarkerDragEvent } from 'react-map-gl';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { Point } from '../../../types';
import { Circle } from '../markers';

const { colors } = theme;

interface Props extends Point {
  testId: string;
  draggable?: boolean;
  selected?: boolean;
  onClick: () => void;
  onDragEnd?: (event: MarkerDragEvent) => void;
  onVehicleRoute?: ReusableComponentsVehicleModeEnum;
  isHighlighted?: boolean;
}

export const Stop = ({
  testId,
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
  const selectedIconSize = 32;

  const vehicleStopColor = onVehicleRoute
    ? colors.stops[onVehicleRoute]
    : 'black';

  const iconBorderColor = isHighlighted
    ? colors.selectedMapItem
    : vehicleStopColor;
  const iconFillColor = onVehicleRoute || selected ? 'white' : colors.lightGrey;

  const iconBorderWidth = 3;
  const centerDotSize = 3;

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      draggable={draggable}
      onDragEnd={onDragEnd}
      className={`${testId} rounded-full`} // the Marker component does not have testid property, neither does data-testid work, so have to use className
    >
      <Circle
        size={selected ? selectedIconSize : iconSize}
        onClick={onClick}
        borderColor={iconBorderColor}
        fillColor={iconFillColor}
        borderWidth={iconBorderWidth}
        centerDot={selected}
        centerDotSize={selected ? centerDotSize * 1.5 : centerDotSize}
      />
    </Marker>
  );
};
