import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineTableRowFragment,
  RouteTableRowFragment,
  ReusableComponentsVehicleModeEnum as VehicleMode,
} from '../generated/graphql';
import { isLine } from '../graphql';

type RowItem = LineTableRowFragment | RouteTableRowFragment;

type VehicleIconProps = {
  readonly className?: string;
  readonly vehicleMode: VehicleMode;
  readonly rowItem: RowItem;
};

export const VehicleIcon: FC<VehicleIconProps> = ({
  className,
  vehicleMode = VehicleMode.Bus,
  rowItem,
}) => {
  const { t } = useTranslation();
  const iconTitle = t(
    isLine(rowItem) ? 'accessibility:lines.bus' : 'accessibility:routes.bus',
  );
  return (
    <i
      className={`icon-${vehicleMode}-alt ${className}`}
      title={iconTitle}
      role="img"
    />
  );
};
