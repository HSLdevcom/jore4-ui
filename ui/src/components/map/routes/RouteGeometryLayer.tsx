import { theme } from '../../../generated/theme';
import { LinePolygonLayer } from './LinePolygonLayer';

const { colors } = theme;

interface Props {
  layerId: string;
  geometry: GeoJSON.LineString;
  defaultColor: string;
  isHighlighted: boolean;
}

// This later renders route as a line polygon
export const RouteGeometryLayer = ({
  layerId,
  geometry,
  defaultColor,
  isHighlighted,
}: Props): JSX.Element => {
  const beforeId = isHighlighted ? undefined : 'route_base';

  const paint: mapboxgl.LinePaint = {
    'line-color': isHighlighted ? colors.selectedMapItem : defaultColor,
    'line-width': isHighlighted ? 9 : 8,
    'line-opacity': isHighlighted ? 1 : 0.75,
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
