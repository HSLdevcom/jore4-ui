// Utilities to construct layer ids from route ids
import { ROUTE_LAYER_ID_PREFIX } from '../Utils';

export function mapRouteIdToLineLayerId(routeId: UUID) {
  return `${ROUTE_LAYER_ID_PREFIX}${routeId}_line`;
}

export function mapRouteIdToArrowLayerId(routeId: UUID) {
  return `${ROUTE_LAYER_ID_PREFIX}${routeId}_arrows`;
}
