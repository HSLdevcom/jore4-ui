import * as React from 'react';

interface Props {
  size?: number;
  borderWidth?: number;
  fillColor?: string;
  borderColor?: string;
  centerDot?: boolean;
  centerDotSize?: number;
  onClick?: () => void;
}

const CircleComponent = ({
  size = 20,
  borderWidth = 2,
  fillColor = 'white',
  borderColor = 'black',
  centerDot = false,
  centerDotSize = 2,
  onClick,
}: Props): JSX.Element => {
  return (
    <svg
      height={size}
      width={size}
      onClick={onClick}
      className="group rounded-full"
      fill={borderColor} // Fill color for center dot to inherit via css
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - borderWidth}
        stroke={borderColor}
        strokeWidth={borderWidth}
        fill={fillColor}
      />
      <circle
        className="group-hover:fill-inherit"
        cx={size / 2}
        cy={size / 2}
        r={centerDotSize}
        fill={centerDot ? borderColor : 'transparent'} // Show dot by default only when specified
      />
    </svg>
  );
};

// Official examples used React.memo, see e.g.
// https://github.com/visgl/react-map-gl/blob/6.1-release/examples/controls/src/pins.js
export const Circle = React.memo(CircleComponent);
