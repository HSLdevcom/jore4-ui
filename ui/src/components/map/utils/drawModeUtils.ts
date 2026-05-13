import MapboxDraw from '@mapbox/mapbox-gl-draw';

type DrawModes = NonNullable<
  NonNullable<ConstructorParameters<typeof MapboxDraw>[0]>['modes']
>;

type DirectSelectState = { featureId?: string; selectedCoordPaths: string[] };
type DrawEvent<TProperties extends object> = {
  featureTarget?: { properties?: TProperties };
};
type FeatureClickEvent = DrawEvent<{ id?: string }>;
type VertexEvent = DrawEvent<{ coord_path?: string }>;
type DrawModeController = {
  changeMode: (mode: 'direct_select', options?: { featureId?: string }) => void;
};

const DEFAULT_MODES = (MapboxDraw as typeof MapboxDraw & { modes: DrawModes })
  .modes;
const DIRECT_SELECT_MODE = DEFAULT_MODES.direct_select as DrawModes[string] & {
  onVertex?: (state: DirectSelectState, e: VertexEvent) => void;
  startDragging?: (state: DirectSelectState, e: VertexEvent) => void;
};
const SIMPLE_SELECT_MODE = DEFAULT_MODES.simple_select as DrawModes[string] & {
  clickOnFeature?: (state: unknown, e: FeatureClickEvent) => void;
};

const changeToDirectSelect = (ctx: unknown, featureId: string) => {
  (ctx as DrawModeController).changeMode('direct_select', { featureId });
};

export const DRAW_MODES: DrawModes = {
  ...DEFAULT_MODES,
  simple_select: {
    ...SIMPLE_SELECT_MODE,
    // Change from simple_select to direct_select on feature click, to immediately show vertices with mid points.
    // Default behavior is to first show vertices, then it requires another click to enter direct_select and show mid points.
    clickOnFeature(this: unknown, state: unknown, e: FeatureClickEvent) {
      const featureId = e.featureTarget?.properties?.id;
      if (featureId) {
        changeToDirectSelect(this, featureId);
      } else {
        SIMPLE_SELECT_MODE.clickOnFeature?.call(this, state, e);
      }
    },
  } as DrawModes[string],
  direct_select: {
    ...DIRECT_SELECT_MODE,
    // Disable vertex selection on click, enforce drag-only behavior.
    // This avoids reloading the edited line when clicking vertices.
    onVertex(this: unknown, state: DirectSelectState, e: VertexEvent) {
      const coordPath = e.featureTarget?.properties?.coord_path;
      if (coordPath) {
        // Drag-only behavior: keep one vertex as drag target, skip click-selection visuals.
        state.selectedCoordPaths = [coordPath];
        DIRECT_SELECT_MODE.startDragging?.call(this, state, e);
      }
    },
  } as DrawModes[string],
};
