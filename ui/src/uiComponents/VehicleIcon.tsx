import { useTranslation } from 'react-i18next';
import {
  LineTableRowFragment,
  RouteTableRowFragment,
  ReusableComponentsVehicleModeEnum as VehicleMode,
} from '../generated/graphql';
import { isLine } from '../graphql';

type RowItem = LineTableRowFragment | RouteTableRowFragment;

interface Props {
  className?: string;
  vehicleMode: VehicleMode;
  rowItem: RowItem;
}

export const VehicleIcon = ({
  className = '',
  vehicleMode = VehicleMode.Bus,
  rowItem,
}: Props) => {
  const { t } = useTranslation();
  const iconTitle = t(
    isLine(rowItem)
      ? 'accessibility:title.line.bus'
      : 'accessibility:title.route.bus',
  );
  return (
    <i
      className={`icon-${vehicleMode}-alt ${className}`}
      title={iconTitle}
      role="img"
    />
  );
};
