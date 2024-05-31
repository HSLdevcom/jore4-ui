import { RENDER_STATE } from 'react-map-gl-draw';

// Handle styles

const RECT_STYLE = {
  x: -10,
  y: -10,
  strokeWidth: 4,
};

export const handleStyle =
  (selectedSnapPoints: number[]) =>
  ({ state, index }: { state: RENDER_STATE; index: number }) => {
    if (state === RENDER_STATE.HOVERED) {
      return {
        ...RECT_STYLE,
        stroke: 'black',
        strokeWidth: 6,
      };
    }
    if (selectedSnapPoints.includes(index)) {
      return {
        ...RECT_STYLE,
        stroke: 'red',
      };
    }
    return {
      ...RECT_STYLE,
      stroke: 'black',
    };
  };

// Feature styles

const FEATURE_INACTIVE_COLOR = '#696969'; // Dark grey
const FEATURE_ACTIVE_COLOR = FEATURE_INACTIVE_COLOR;

const FEATURE_STYLE = {
  strokeWidth: 6,
  fill: 'none',
};

const SELECTED_STYLE = {
  stroke: FEATURE_ACTIVE_COLOR,
};

const HOVERED_STYLE = { ...SELECTED_STYLE };

const UNCOMMITTED_STYLE = {
  stroke: FEATURE_INACTIVE_COLOR,
  strokeDasharray: '8,3',
};

const INACTIVE_STYLE = { ...UNCOMMITTED_STYLE };

const DEFAULT_STYLE = {
  stroke: 'black',
};

export const featureStyle = ({ state }: { state: RENDER_STATE }) => {
  let style = null;

  switch (state) {
    case RENDER_STATE.SELECTED:
      style = { ...SELECTED_STYLE };
      break;

    case RENDER_STATE.HOVERED:
      style = { ...HOVERED_STYLE };
      break;

    case RENDER_STATE.UNCOMMITTED:
    case RENDER_STATE.CLOSING:
      style = { ...UNCOMMITTED_STYLE };
      break;

    case RENDER_STATE.INACTIVE:
      style = { ...INACTIVE_STYLE };
      break;

    default:
      style = { ...DEFAULT_STYLE };
  }

  return { ...FEATURE_STYLE, ...style };
};
