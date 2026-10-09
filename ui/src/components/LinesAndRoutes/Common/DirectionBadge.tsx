import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import {
  ReusableComponentsVehicleModeEnum,
  RouteDirectionEnum,
  RouteTypeOfLineEnum,
} from '../../../generated/graphql';
import {
  mapDirectionToSymbol,
  mapDirectionToUiName,
} from '../../../utils/i18n';
import { mapVehicleModeToRouteColor } from '../../Map/Routes/Utils/mapVehicleModeToRouteColor';

const testIds = {
  container: 'DirectionBadge',
  directionBadge: (direction: RouteDirectionEnum) =>
    `DirectionBadge::${direction}`,
};
export const directionBadgeTestIds = testIds;

type DirectionBadgeProps = {
  readonly direction: RouteDirectionEnum;
  readonly className?: string;
  readonly vehicleMode?: ReusableComponentsVehicleModeEnum;
  readonly lineType?: RouteTypeOfLineEnum;
};

export const DirectionBadge: FC<DirectionBadgeProps> = ({
  direction,
  className,
  vehicleMode,
  lineType,
}) => {
  const { t } = useTranslation();

  const directionText = mapDirectionToUiName(t, direction);
  const backgroundColor = mapVehicleModeToRouteColor(
    vehicleMode ?? ReusableComponentsVehicleModeEnum.Bus,
    lineType,
  );

  return (
    <span
      title={directionText}
      data-testid={testIds.container}
      style={{ backgroundColor }}
      className={twMerge(
        'flex h-9 w-9 items-center justify-center text-2xl font-bold text-white',
        className,
      )}
    >
      <span
        aria-hidden
        aria-label={directionText}
        data-testid={testIds.directionBadge(direction)}
      >
        {mapDirectionToSymbol(t, direction)}
      </span>
    </span>
  );
};
