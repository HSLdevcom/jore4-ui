import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import {
  LineTableRowFragment,
  ReusableComponentsVehicleModeEnum,
  RouteTableRowFragment,
  RouteTypeOfLineEnum,
} from '../../../../generated/graphql';
import { getTransportModeIcon, isLine } from '../../../../utils';

type RowItem = LineTableRowFragment | RouteTableRowFragment;

function resolveVehicleMode(
  rowItem: RowItem,
): ReusableComponentsVehicleModeEnum {
  if ('primary_vehicle_mode' in rowItem) {
    return rowItem.primary_vehicle_mode;
  }

  return rowItem.route_line.primary_vehicle_mode;
}

function resolveLineType(rowItem: RowItem): RouteTypeOfLineEnum {
  if ('type_of_line' in rowItem) {
    return rowItem.type_of_line;
  }

  return rowItem.route_line.type_of_line;
}

type VehicleIconProps = {
  readonly className?: string;
  readonly rowItem: RowItem;
};

export const VehicleIcon: FC<VehicleIconProps> = ({ className, rowItem }) => {
  const { t } = useTranslation();
  const iconTitle = t(($) =>
    isLine(rowItem) ? $.accessibility.lines.bus : $.accessibility.routes.bus,
  );
  return (
    <i
      className={twMerge(
        getTransportModeIcon(
          resolveVehicleMode(rowItem),
          resolveLineType(rowItem),
        ),
        className,
      )}
      title={iconTitle}
      role="img"
    />
  );
};
