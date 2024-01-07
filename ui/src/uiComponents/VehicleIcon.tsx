import { useTranslation } from 'react-i18next';
import {
  LineTableRowFragment,
  RouteTableRowFragment,
  ReusableComponentsVehicleModeEnum as Vehicle,
} from '../generated/graphql';
import { isLine } from '../graphql';

type RowItem = LineTableRowFragment | RouteTableRowFragment;

interface Props {
  className?: string;
  vehicleType: Vehicle;
  rowItem: RowItem;
}

export const VehicleIcon = ({
  className = '',
  vehicleType = Vehicle.Bus,
  rowItem,
}: Props) => {
  const { t } = useTranslation(); // TODO: Can't use in parent because it's not a hook?
  let iconTitle = t('accessibility:title.route.icon', {
    vehicleType: t(`vehicleModeEnum.${vehicleType}`),
  });
  if (isLine(rowItem)) {
    iconTitle = t('accessibility:title.line.icon', {
      vehicleType: t(`vehicleModeEnum.${vehicleType}`),
    });
  }
  return (
    <i
      className={`icon-${vehicleType}-alt ${className}`}
      title={iconTitle}
      role="img"
    />
  );
};
