import { Marker } from 'react-map-gl/maplibre';
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
  vehicleMode?: ReusableComponentsVehicleModeEnum;
  isHighlighted?: boolean;
}

/** Stop map markers border color is determined in this function. There are
 * different aspects which are affecting this determination. These are
 * * isPlaceholder: when moving a stop we have a placeholder for the stop's
 * original location.
 * * isHighlighted: if the stop is selected, or we are highlighting the stop because
 * it belongs to a currently selected route.
 * * stopVehicleMode: If neither of the above applies and vehicleMode is given,
 * we use the vehicleMode color defined in colors theme.
 * * If none of the above apply, we use 'black' as the border color
 */
const determineBorderColor = (
  isHilighted: boolean,
  isPlaceholder: boolean,
  stopVehicleMode?: ReusableComponentsVehicleModeEnum,
) => {
  if (isPlaceholder) {
    return colors.grey;
  }
  if (isHilighted) {
    return colors.selectedMapItem;
  }
  if (stopVehicleMode) {
    return colors.stops[stopVehicleMode] ?? 'black';
  }

  return 'black';
};

export const Stop = ({
  testId,
  latitude,
  longitude,
  onClick,
  selected = false,
  vehicleMode = undefined,
  isHighlighted = false,
}: Props): JSX.Element => {
  const isMoveStopModeEnabled = useAppSelector(selectIsMoveStopModeEnabled);
  const iconSize = 30;
  const selectedIconSize = 32;
  // If the stop is being moved, we use different styles for the stop
  // to indicate the placeholder of the old location
  const isPlaceholder = selected && isMoveStopModeEnabled;
  const iconBorderColor = determineBorderColor(
    isHighlighted,
    isPlaceholder,
    vehicleMode,
  );

  const iconFillColor =
    vehicleMode !== undefined || selected ? 'white' : colors.lightGrey;

  const iconBorderWidth = 3;
  const centerDotSize = 3;

  return (
    <Marker longitude={longitude} latitude={latitude}>
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
