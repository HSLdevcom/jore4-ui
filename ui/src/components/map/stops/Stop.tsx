import { FC } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { MapEntityEditorViewState } from '../../../redux';
import { StopMarker } from '../markers';
import { MapStop } from '../types';

const { colors } = theme;

const iconSize = 30;
const selectedIconSize = 32;
const centerDotSize = 6;

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
function determineBorderColor(
  isHighlighted: boolean,
  asMemberStop: boolean,
  isSelected: boolean,
  isPlaceholder: boolean,
  stopVehicleMode: ReusableComponentsVehicleModeEnum | undefined,
  inSelection: boolean,
) {
  if (inSelection) {
    return colors.tweakedBrand;
  }

  if (isPlaceholder) {
    return colors.grey;
  }

  if (isSelected) {
    return colors.hslDark80;
  }

  if (inSelection || asMemberStop) {
    return colors.tweakedBrand;
  }

  if (isHighlighted) {
    return colors.selectedMapItem;
  }

  if (stopVehicleMode) {
    return colors.stops[stopVehicleMode] ?? colors.hslDark80;
  }

  return colors.hslDark80;
}

function determineFillColor(
  asMemberStop: boolean,
  isSelected: boolean,
  stopVehicleMode: ReusableComponentsVehicleModeEnum | undefined,
  inSelection: boolean,
) {
  if (
    stopVehicleMode !== undefined ||
    isSelected ||
    asMemberStop ||
    inSelection
  ) {
    return 'white';
  }

  return colors.lightGrey;
}

type BaseStopProps = {
  readonly longitude: number;
  readonly latitude: number;
  readonly inSelection?: boolean;
  readonly isHighlighted?: boolean;
  readonly asMemberStop?: boolean;
  readonly mapStopViewState: MapEntityEditorViewState;
  readonly selected?: boolean;
  readonly testId?: string;
  readonly vehicleMode?: ReusableComponentsVehicleModeEnum;
};

type ExistingStopSpecialProps = {
  readonly onClick: (stop: MapStop) => void;
  readonly onResolveTitle: (stop: MapStop) => Promise<string | null>;
  readonly stop: MapStop;
};

type ExistingStopSpecialPropsNever = {
  readonly [key in keyof ExistingStopSpecialProps]?: never;
};

type ExistingStopProps = BaseStopProps & ExistingStopSpecialProps;

type PlaceholderStopProps = BaseStopProps & ExistingStopSpecialPropsNever;

type StopProps = PlaceholderStopProps | ExistingStopProps;

export const Stop: FC<StopProps> = ({
  isHighlighted = false,
  inSelection = false,
  asMemberStop = false,
  latitude,
  longitude,
  mapStopViewState,
  selected = false,
  testId,
  vehicleMode,
  onClick,
  onResolveTitle,
  stop,
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
    inSelection,
  );

  const iconFillColor = determineFillColor(
    asMemberStop,
    selected,
    vehicleMode,
    inSelection,
  );

  return (
    <Marker longitude={longitude} latitude={latitude} className="z-[2]">
      <StopMarker
        size={selected ? selectedIconSize : iconSize}
        testId={testId}
        borderColor={iconBorderColor}
        fillColor={iconFillColor}
        borderWidth={3}
        strokeDashArray={isPlaceholder ? 2 : 0}
        centerDot={selected}
        centerDotSize={selected ? centerDotSize * 1.5 : centerDotSize}
        inSelection={inSelection}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...(stop
          ? ({ onClick, onResolveTitle, stop } as ExistingStopSpecialProps)
          : ({} as ExistingStopSpecialPropsNever))}
      />
    </Marker>
  );
};
