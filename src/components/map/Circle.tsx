import * as React from 'react';

interface Props {
  size?: number;
  borderWidth?: number;
  fillColor?: string;
  borderColor?: string;
  centerDot?: boolean;
  onClick?: () => void;
}

const CircleComponent = ({
  size = 20,
  borderWidth = 2,
  fillColor = 'white',
  borderColor = 'black',
  centerDot = false,
  onClick,
}: Props): JSX.Element => {
  return (
    <svg height={size} width={size} onClick={onClick}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - borderWidth}
        stroke={borderColor}
        strokeWidth={borderWidth}
        fill={fillColor}
      />
      {centerDot && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={1}
          stroke={borderColor}
          strokeWidth={borderWidth}
          fill={fillColor}
        />
      )}
    </svg>
  );
};

// Official examples used React.memo, see e.g.
// https://github.com/visgl/react-map-gl/blob/6.1-release/examples/controls/src/pins.js
export const Circle = React.memo(CircleComponent);
