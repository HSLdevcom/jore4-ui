import {
  ReusableComponentsVehicleModeEnum,
  useGetRouteRenderInfoByIdQuery,
} from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { mapRouteResultToRoute } from '../../../graphql';
import { mapToVariables } from '../../../utils';
import { LinePolygonLayer } from './LinePolygonLayer';

const { colors } = theme;

export const ROUTE_LAYER_ID_PREFIX = 'route_id_';

// utilities to allow finding the original route's id based on the layer's id
export const isRouteGeometryLayer = (layerId: string) =>
  layerId.startsWith(ROUTE_LAYER_ID_PREFIX);
export const mapRouteIdToLayerId = (routeId: UUID) =>
  `${ROUTE_LAYER_ID_PREFIX}${routeId}`;
export const mapLayerIdToRouteId = (layerId: string) =>
  layerId.substring(ROUTE_LAYER_ID_PREFIX.length);

interface RouteGeometryLayerProps {
  routeId: string;
  isSelected: boolean;
}

// This layer fetches a single route's geometry and renders it as a line polygon
export const RouteGeometryLayer = ({
  routeId,
  isSelected,
}: RouteGeometryLayerProps) => {
  const routeRenderInfoResult = useGetRouteRenderInfoByIdQuery(
    mapToVariables({ routeId }),
  );
  const routeRenderInfo = mapRouteResultToRoute(routeRenderInfoResult);

  // do not render anything before data is received
  if (!routeRenderInfo?.route_shape) {
    return null;
  }

  const beforeId = isSelected ? undefined : 'route_base';

  const vehicleMode =
    routeRenderInfo.route_line?.primary_vehicle_mode ||
    ReusableComponentsVehicleModeEnum.Bus;

  const paint: mapboxgl.LinePaint = {
    'line-color': isSelected
      ? colors.selectedMapItem
      : colors.routes[vehicleMode],
    'line-width': isSelected ? 9 : 8,
    'line-opacity': isSelected ? 1 : 0.75,
    'line-offset': 6,
  };

  return (
    <LinePolygonLayer
      layerId={mapRouteIdToLayerId(routeId)}
      geometry={routeRenderInfo.route_shape}
      paint={paint}
      beforeId={beforeId}
    />
  );
};
