import { FC } from 'react';
import { theme } from '../../../generated/theme';
import { ArrowLayout, ArrowPaint, ArrowRenderLayer } from './ArrowRenderLayer';
import { LinePaint, LineRenderLayer } from './LineRenderLayer';

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

type RouteGeometryLayerProps = {
  readonly routeId?: UUID;
  readonly geometry: GeoJSON.LineString;
  readonly defaultColor?: string;
  readonly isHighlighted: boolean;
};

export const NEW_ROUTE_LINE_ID = 'new_route_line';
export const NEW_ROUTE_ARROWS_ID = 'new_route_arrows';

// This layer renders route on map
export const RouteGeometryLayer: FC<RouteGeometryLayerProps> = ({
  routeId,
  geometry,
  defaultColor = colors.routes.bus,
  isHighlighted,
}) => {
  const beforeId = isHighlighted ? undefined : 'route_base';

  const color = isHighlighted ? colors.selectedMapItem : defaultColor;

  // Offset line to right side of the infra link
  const lineOffset = 6;

  const linePaint: LinePaint = {
    'line-color': color,
    'line-width': isHighlighted ? 9 : 8,
    'line-offset': lineOffset,
  };

  const arrowLayout: Partial<ArrowLayout> = {
    'icon-offset': [0, lineOffset],
  };

  const arrowPaint: ArrowPaint = {
    'icon-color': color,
  };

  const lineRenderLayerId = routeId
    ? mapRouteIdToLineLayerId(routeId)
    : NEW_ROUTE_LINE_ID;
  const arrowRenderLayerId = routeId
    ? mapRouteIdToArrowLayerId(routeId)
    : NEW_ROUTE_ARROWS_ID;

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
