import {
  ReusableComponentsVehicleModeEnum,
  useGetRouteRenderInfoByIdQuery,
} from '../../../generated/graphql';
import { mapRouteResultToRoute } from '../../../graphql';
import { mapToVariables } from '../../../utils';
import { mapVehicleModeToRouteColor } from '../../../utils/colors';
import { RouteGeometryLayer } from './RouteGeometryLayer';

interface Props {
  routeId: string;
  isSelected: boolean;
}

// This layer fetches a single route's geometry and renders it as a line
export const ExistingRouteGeometryLayer = ({
  routeId,
  isSelected,
}: Props): JSX.Element => {
  const routeRenderInfoResult = useGetRouteRenderInfoByIdQuery(
    mapToVariables({ routeId }),
  );
  const routeRenderInfo = mapRouteResultToRoute(routeRenderInfoResult);

  // do not render anything before data is received
  if (!routeRenderInfo?.route_shape) {
    return <></>;
  }

  const vehicleMode =
    routeRenderInfo.route_line?.primary_vehicle_mode ||
    ReusableComponentsVehicleModeEnum.Bus;

  const routeColor = mapVehicleModeToRouteColor(vehicleMode);

  return (
    <RouteGeometryLayer
      routeId={routeId}
      geometry={routeRenderInfo.route_shape}
      defaultColor={routeColor}
      isHighlighted={isSelected}
    />
  );
};
