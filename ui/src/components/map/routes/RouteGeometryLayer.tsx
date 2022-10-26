import { theme } from '../../../generated/theme';
import { LineArrowLayer } from './LineArrowLayer';
import { LinePolygonLayer } from './LinePolygonLayer';

const { colors } = theme;

interface Props {
  layerId: string;
  geometry: GeoJSON.LineString;
  defaultColor: string;
  isHighlighted: boolean;
}

// This layer renders route on map
export const RouteGeometryLayer = ({
  layerId,
  geometry,
  defaultColor,
  isHighlighted,
}: Props): JSX.Element => {
  const beforeId = isHighlighted ? undefined : 'route_base';

  const color = isHighlighted ? colors.selectedMapItem : defaultColor;

  // Offset line to right side of the infra link
  const lineOffset = 6;

  const linePaint: mapboxgl.LinePaint = {
    'line-color': color,
    'line-width': isHighlighted ? 9 : 8,
    'line-offset': lineOffset,
  };

  const arrowLayout: mapboxgl.SymbolLayout = {
    'icon-offset': [0, lineOffset],
  };

  const arrowPaint: mapboxgl.SymbolPaint = {
    'icon-color': color,
  };

  return (
    <>
      <LinePolygonLayer
        layerId={layerId}
        geometry={geometry}
        paint={linePaint}
        beforeId={beforeId}
      />
      <LineArrowLayer
        layerId={`arrows_for_${layerId}`}
        geometry={geometry}
        layout={arrowLayout}
        paint={arrowPaint}
        beforeId={layerId}
      />
    </>
  );
};
