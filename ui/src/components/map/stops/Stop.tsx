import { Marker } from 'react-map-gl';
import { CallbackEvent } from 'react-map-gl/src/components/draggable-control';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { useAppSelector } from '../../../hooks';
import { selectIsMoveStopModeEnabled } from '../../../redux';
import { Point } from '../../../types';
import { Circle } from '../markers';

const { colors } = theme;

interface Props extends Point {
  testId?: string;
  selected?: boolean;
  onClick: () => void;
  onDragEnd?: (event: CallbackEvent) => void;
  onVehicleRoute?: ReusableComponentsVehicleModeEnum;
  isHighlighted?: boolean;
}

const getBorderColor = (
  isHilighted: boolean,
  isPlaceholder: boolean,
  onVehicleRoute?: ReusableComponentsVehicleModeEnum,
) => {
  if (isPlaceholder) {
    return colors.grey;
  }
  if (isHilighted) {
    return colors.selectedMapItem;
  }
  const vehicleStopColor = onVehicleRoute
    ? colors.stops[onVehicleRoute]
    : 'black';

  return vehicleStopColor;
};

export const Stop = ({
  testId,
  latitude,
  longitude,
  onClick,
  onDragEnd,
  selected = false,
  onVehicleRoute = undefined,
  isHighlighted = false,
}: Props): JSX.Element => {
  const isMoveStopModeEnabled = useAppSelector(selectIsMoveStopModeEnabled);
  const iconSize = 30;
  const selectedIconSize = 32;
  // If the stop is being moved, we use different styles for the stop
  // to indicate the placeholder of the old location
  const isPlaceholder = selected && isMoveStopModeEnabled;
  const iconBorderColor = getBorderColor(
    isHighlighted,
    isPlaceholder,
    onVehicleRoute,
  );

  const iconFillColor = onVehicleRoute || selected ? 'white' : colors.lightGrey;

  const iconBorderWidth = 3;
  const centerDotSize = 3;

  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      offsetTop={-1 * ((selected ? selectedIconSize : iconSize) / 2)}
      offsetLeft={-1 * ((selected ? selectedIconSize : iconSize) / 2)}
      onDragEnd={onDragEnd}
      className="rounded-full"
    >
      <Circle
        size={selected ? selectedIconSize : iconSize}
        testId={testId}
        onClick={onClick}
        borderColor={iconBorderColor}
        fillColor={iconFillColor}
        borderWidth={iconBorderWidth}
        strokeDashArray={isPlaceholder ? 2 : 0}
        centerDot={selected}
        centerDotSize={selected ? centerDotSize * 1.5 : centerDotSize}
      />
    </Marker>
  );
};
