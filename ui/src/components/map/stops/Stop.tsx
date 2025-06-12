import { FC } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { MapEntityEditorViewState } from '../../../redux';
import { Point } from '../../../types';
import { Circle } from '../markers';

const { colors } = theme;

const iconSize = 30;
const selectedIconSize = 32;
const centerDotSize = 3;

/** Stop map markers border color is determined in this function. There are
 * different aspects which are affecting this determination. These are
 * * isPlaceholder: when moving a stop we have a placeholder for the stop's
 * original location.
 * * isSelected: if the stop is selected.
 * * isHighlighted: if the stop is highlighted because it belongs to a currently selected route.
 * * stopVehicleMode: If neither of the above applies and vehicleMode is given,
 * we use the vehicleMode color defined in colors theme.
 * * If none of the above apply, we use 'hsl-dark-80' as the border color
 */
const determineBorderColor = (
  isHighlighted: boolean,
  asMemberStop: boolean,
  isSelected: boolean,
  isPlaceholder: boolean,
  stopVehicleMode?: ReusableComponentsVehicleModeEnum,
) => {
  if (isPlaceholder) {
    return colors.grey;
  }

  if (isSelected) {
    return colors.hslDark80;
  }

  if (asMemberStop) {
    return colors.tweakedBrand;
  }

  if (isHighlighted) {
    return colors.selectedMapItem;
  }

  if (stopVehicleMode) {
    return colors.stops[stopVehicleMode] ?? colors.hslDark80;
  }

  return colors.hslDark80;
};

type StopProps = {
  readonly isHighlighted?: boolean;
  readonly asMemberStop?: boolean;
  readonly mapStopViewState: MapEntityEditorViewState;
  readonly onClick: () => void;
  readonly selected?: boolean;
  readonly testId?: string;
  readonly vehicleMode?: ReusableComponentsVehicleModeEnum;
} & Point;

export const Stop: FC<StopProps> = ({
  isHighlighted = false,
  asMemberStop = false,
  latitude,
  longitude,
  mapStopViewState,
  onClick,
  selected = false,
  testId,
  vehicleMode = undefined,
}) => {
  // If the stop is being moved, we use different styles for the stop
  // to indicate the placeholder of the old location
  const isPlaceholder =
    selected && mapStopViewState === MapEntityEditorViewState.MOVE;
  const iconBorderColor = determineBorderColor(
    isHighlighted,
    asMemberStop,
    selected,
    isPlaceholder,
    vehicleMode,
  );

  const iconFillColor =
    vehicleMode !== undefined || selected || asMemberStop
      ? 'white'
      : colors.lightGrey;

  return (
    <Marker longitude={longitude} latitude={latitude}>
      <Circle
        size={selected ? selectedIconSize : iconSize}
        testId={testId}
        onClick={onClick}
        borderColor={iconBorderColor}
        fillColor={iconFillColor}
        borderWidth={3}
        strokeDashArray={isPlaceholder ? 2 : 0}
        centerDot={selected}
        centerDotSize={selected ? centerDotSize * 1.5 : centerDotSize}
      />
    </Marker>
  );
};
