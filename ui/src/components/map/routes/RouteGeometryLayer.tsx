import { theme } from '../../../generated/theme';
import { ArrowRenderLayer } from './ArrowRenderLayer';
import { LineRenderLayer } from './LineRenderLayer';

const { colors } = theme;

export const ROUTE_LAYER_ID_PREFIX = 'route_id_';
// Get route id between route layer id prefix and _line/_arrows postfix
const ROUTE_ID_FROM_LAYER_ID_REGEX = new RegExp(
  `(?<=${ROUTE_LAYER_ID_PREFIX})(.*)(?=_)`,
);

// Utilities to construct layer ids from route ids
export const mapRouteIdToLineLayerId = (routeId: UUID) =>
  `${ROUTE_LAYER_ID_PREFIX}${routeId}_line`;
export const mapRouteIdToArrowLayerId = (routeId: UUID) =>
  `${ROUTE_LAYER_ID_PREFIX}${routeId}_arrows`;

// Utilities to allow finding the original route's id based on the layer's id
export const isRouteGeometryLayer = (layerId: string) =>
  layerId.startsWith(ROUTE_LAYER_ID_PREFIX);
export const mapLayerIdToRouteId = (layerId: string) => {
  const matches = layerId.match(ROUTE_ID_FROM_LAYER_ID_REGEX);

  return matches?.length ? (matches[0] as UUID) : undefined;
};

interface Props {
  routeId?: UUID;
  geometry: GeoJSON.LineString;
  defaultColor?: string;
  isHighlighted: boolean;
}

// This layer renders route on map
export const RouteGeometryLayer = ({
  routeId,
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

  const lineRenderLayerId = routeId
    ? mapRouteIdToLineLayerId(routeId)
    : 'new_route_line';
  const arrowRenderLayerId = routeId
    ? mapRouteIdToArrowLayerId(routeId)
    : 'new_route_arrows';

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
