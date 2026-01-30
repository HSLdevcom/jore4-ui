/**
 * Composite key allows the same stop to have different selection states on different routes.
 */

export const createCompositeKey = (routeId: string, stopId: string): string =>
  `${routeId}:${stopId}`;
