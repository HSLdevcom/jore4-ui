import {
  ReusableComponentsVehicleModeEnum,
  useGetRouteRenderInfoByIdQuery,
} from '../../../generated/graphql';
import { mapRouteResultToRoute } from '../../../graphql';
import { mapToVariables } from '../../../utils';
import { mapVehicleModeToRouteColor } from '../../../utils/colors';
import { RouteGeometryLayer } from './RouteGeometryLayer';

const ROUTE_LAYER_ID_PREFIX = 'route_id_';
// Get route id between route layer id prefix and _line/_arrows postfix
const ROUTE_ID_FROM_LAYER_ID_REGEX = new RegExp(
  `(?<=${ROUTE_LAYER_ID_PREFIX})(.*)(?=_)`,
);

// utilities to allow finding the original route's id based on the layer's id
export const isRouteGeometryLayer = (layerId: string) =>
  layerId.startsWith(ROUTE_LAYER_ID_PREFIX);
export const mapRouteIdToLayerId = (routeId: UUID) =>
  `${ROUTE_LAYER_ID_PREFIX}${routeId}`;
export const mapLayerIdToRouteId = (layerId: string) => {
  const matches = layerId.match(ROUTE_ID_FROM_LAYER_ID_REGEX);

  return matches?.length ? (matches[0] as UUID) : undefined;
};

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
      layerId={mapRouteIdToLayerId(routeId)}
      geometry={routeRenderInfo.route_shape}
      defaultColor={routeColor}
      isHighlighted={isSelected}
    />
  );
};
