const FEATURE_INACTIVE_COLOR = '#696969'; // Dark grey
const FEATURE_ACTIVE_COLOR = FEATURE_INACTIVE_COLOR;

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
      'line-color': FEATURE_INACTIVE_COLOR,
      'line-dasharray': [1.2, 0.8],
      'line-width': 8,
    },
  },
  {
    id: 'gl-draw-polygon-midpoint',
    type: 'circle',
    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
    paint: {
      'circle-radius': 8,
      'circle-color': FEATURE_INACTIVE_COLOR,
    },
  },
  {
    id: 'gl-draw-line-vertex-halo-inactive',
    type: 'circle',
    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
    paint: {
      'circle-radius': 12,
      'circle-color': FEATURE_INACTIVE_COLOR,
    },
  },
  {
    id: 'gl-draw-line-vertex-inactive',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static'],
      ['!=', 'mode', 'simple_select'],
    ],
    paint: {
      'circle-radius': 9,
      'circle-color': 'white',
    },
  },
  {
    id: 'gl-draw-line-vertex-active',
    type: 'circle',
    filter: [
      'all',
      ['==', 'meta', 'vertex'],
      ['==', '$type', 'Point'],
      ['!=', 'mode', 'static'],
      ['==', 'active', 'true'],
    ],
    paint: {
      'circle-radius': 4,
      'circle-color': FEATURE_ACTIVE_COLOR,
    },
  },
];
