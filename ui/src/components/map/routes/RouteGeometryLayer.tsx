import { ReusableComponentsVehicleModeEnum } from '../../../generated/graphql';
import { theme } from '../../../generated/theme';
import { LinePolygonLayer } from './LinePolygonLayer';

const { colors } = theme;

interface RouteGeometryLayerProps {
  layerId: string;
  geometry: GeoJSON.LineString;
  vehicleMode: ReusableComponentsVehicleModeEnum;
  isSelected: boolean;
}

// This layer fetches a single route's geometry and renders it as a line polygon
export const RouteGeometryLayer = ({
  layerId,
  geometry,
  vehicleMode,
  isSelected,
}: RouteGeometryLayerProps): JSX.Element => {
  const beforeId = isSelected ? undefined : 'route_base';

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
      layerId={layerId}
      geometry={geometry}
      paint={paint}
      beforeId={beforeId}
    />
  );
};
