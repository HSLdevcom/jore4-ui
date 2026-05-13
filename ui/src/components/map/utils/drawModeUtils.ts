import MapboxDraw, {
  DrawCustomMode,
  DrawCustomModeThis,
  MapMouseEvent,
  MapTouchEvent,
  MapboxDrawOptions,
} from '@mapbox/mapbox-gl-draw';

const defaultModes = MapboxDraw.modes;
const directSelectMode = defaultModes.direct_select;
const simpleSelectMode = defaultModes.simple_select;

type ObjectLikeState = { [key: string]: unknown };

// Change from simple_select to direct_select on feature click, to immediately show vertices with mid-points.
// Default behavior is to first show vertices, then it requires another click to enter direct_select and show mid-points.
// Internally onTap = onClick = function implementation()... by default.
function onSimpleModeClick(
  this: DrawCustomModeThis & DrawCustomMode,
  state: ObjectLikeState,
  e: MapMouseEvent | MapTouchEvent,
) {
  const isFeature = MapboxDraw.lib.CommonSelectors.isFeature(e);
  const featureId = e.featureTarget?.properties?.id;

  if (isFeature && featureId) {
    this.changeMode('direct_select', { featureId });
  } else {
    simpleSelectMode.onClick?.call(this, state, e as MapMouseEvent);
  }
}

// Disable vertex selection on click, enforce drag-only behavior.
// This avoids reloading the edited line when clicking vertices.
// Internally onTouchStart = onMouseDown = function implementation()... by default.
function onDirectModeMouseDown(
  this: DrawCustomModeThis & DrawCustomMode,
  state: ObjectLikeState,
  e: MapMouseEvent | MapTouchEvent,
) {
  const isVertex = MapboxDraw.lib.CommonSelectors.isVertex(e);

  // This replaces onVertex code path from:
  // https://github.com/mapbox/mapbox-gl-draw/blob/eb42344e32ec884c6f15fe483ad1c9311c309a36/src/modes/direct_select.js#L51
  if (isVertex) {
    // Drag-only behavior: keep one vertex as drag target, skip click-selection visuals.
    const coordPath = e.featureTarget.properties?.coord_path;
    if (coordPath) {
      state.selectedCoordPaths = [coordPath];

      // This calls a private function from the internal implementation from:
      // https://github.com/mapbox/mapbox-gl-draw/blob/eb42344e32ec884c6f15fe483ad1c9311c309a36/src/modes/direct_select.js#L30
      if (
        'startDragging' in directSelectMode &&
        typeof directSelectMode.startDragging === 'function'
      ) {
        directSelectMode.startDragging.call(this, state, e);
      } else {
        throw new Error(
          'mapbox-gl-draw DirectDrawMode internal implementation changed! Expected to find function startDragging, but it does not exist!',
        );
      }
    }
  } else {
    directSelectMode.onMouseDown?.call(this, state, e as MapMouseEvent);
  }
}

export const joreDrawModes: MapboxDrawOptions['modes'] = {
  ...defaultModes,
  simple_select: {
    ...simpleSelectMode,
    onClick: onSimpleModeClick,
    onTap: onSimpleModeClick,
  },
  direct_select: {
    ...directSelectMode,
    onMouseDown: onDirectModeMouseDown,
    onTouchStart: onDirectModeMouseDown,
  },
};
