import { theme } from '../../../generated/theme';

export const ACTIVE_LINE_STROKE_ID = 'active-line-stroke';

export const styles = [
  {
    id: ACTIVE_LINE_STROKE_ID,
    type: 'line',
    filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
    layout: {
      'line-cap': 'butt',
      'line-join': 'round',
    },
    paint: {
      'line-color': theme.colors.hslDark80,
      'line-dasharray': [1, 0.5],
      'line-width': 2,
    },
  },
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'symbol',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    layout: {
      'icon-image': 'route_vector_icon',
      'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 0.11, 16, 0.2],
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    },
  },
  {
    id: 'gl-draw-line-vertex-inactive',
    type: 'symbol',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
    layout: {
      'icon-image': 'route_vector_icon',
      'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 0.17, 16, 0.27],
      'icon-allow-overlap': true,
      'icon-ignore-placement': true,
    },
  },
];
