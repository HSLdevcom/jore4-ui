import { theme } from '../../../generated/theme';
import { ArrowRenderLayer } from './ArrowRenderLayer';
import { LineRenderLayer } from './LineRenderLayer';

const { colors } = theme;

interface Props {
  layerId: string;
  geometry: GeoJSON.LineString;
  defaultColor?: string;
  isHighlighted: boolean;
}

// This layer renders route on map
export const RouteGeometryLayer = ({
  layerId,
  geometry,
  defaultColor = colors.routes.bus,
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

  const lineRenderLayerId = `${layerId}_line`;
  const arrowRenderLayerId = `${layerId}_arrows`;

  return (
    <>
      <LineRenderLayer
        layerId={lineRenderLayerId}
        geometry={geometry}
        paint={linePaint}
        beforeId={beforeId}
      />
      <ArrowRenderLayer
        layerId={arrowRenderLayerId}
        geometry={geometry}
        layout={arrowLayout}
        paint={arrowPaint}
        beforeId={lineRenderLayerId}
        minzoom={12}
      />
    </>
  );
};
