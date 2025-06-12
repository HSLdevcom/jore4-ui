export const NEW_ROUTE_LINE_ID = 'new_route_line';
export const NEW_ROUTE_ARROWS_ID = 'new_route_arrows';

const ROUTE_LAYER_ID_PREFIX = 'route_id_';
// Get route id between route layer id prefix and _line/_arrows postfix
const ROUTE_ID_FROM_LAYER_ID_REGEX = new RegExp(
  `(?<=${ROUTE_LAYER_ID_PREFIX})(.*)(?=_)`,
);

// Utilities to construct layer ids from route ids
export function mapRouteIdToLineLayerId(routeId: UUID) {
  return `${ROUTE_LAYER_ID_PREFIX}${routeId}_line`;
}

export function mapRouteIdToArrowLayerId(routeId: UUID) {
  return `${ROUTE_LAYER_ID_PREFIX}${routeId}_arrows`;
}

// Utilities to allow finding the original route's id based on the layer's id
export function isRouteGeometryLayer(layerId: string) {
  return layerId.startsWith(ROUTE_LAYER_ID_PREFIX);
}

export function mapLayerIdToRouteId(layerId: string) {
  const matches = layerId.match(ROUTE_ID_FROM_LAYER_ID_REGEX);

  return matches?.length ? (matches[0] as UUID) : undefined;
}
