export const ROUTE_BASE_LAYER_ID = 'route_base';

export const ACTIVE_LINE_STROKE_ID = 'active-line-stroke';

export const NEW_ROUTE_LINE_ID = 'new_route_line';
export const NEW_ROUTE_ARROWS_ID = 'new_route_arrows';
export const SNAPPING_LINE_LAYER_ID = 'snapping-line';

export const DRAW_VERTEX_LAYER_IDS = [
  'gl-draw-line-vertex-inactive.hot',
  'gl-draw-line-vertex-inactive.cold',
  'gl-draw-polygon-midpoint.hot',
  'gl-draw-polygon-midpoint.cold',
];

export const ROUTE_LAYER_ID_PREFIX = 'route_id_';
// Get route id between route layer id prefix and _line/_arrows postfix
export const ROUTE_ID_FROM_LAYER_ID_REGEX = new RegExp(
  `(?<=${ROUTE_LAYER_ID_PREFIX})(.*)(?=_)`,
);
