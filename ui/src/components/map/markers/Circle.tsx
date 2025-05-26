import { FC, memo, useState } from 'react';

type CircleComponentProps = {
  readonly testId?: string;
  readonly size?: number;
  readonly borderWidth?: number;
  readonly fillColor?: string;
  readonly borderColor?: string;
  readonly strokeDashArray?: number;
  readonly centerDot?: boolean;
  readonly centerDotSize?: number;
  readonly onClick?: () => void;
};

const CircleComponent: FC<CircleComponentProps> = ({
  testId,
  size = 20,
  borderWidth = 2,
  fillColor = 'white',
  borderColor = 'black',
  strokeDashArray = 0,
  centerDot = false,
  centerDotSize = 2,
  onClick,
}) => {
  const [isMouseHovering, setIsMouseHovering] = useState(false);
  return (
    <svg
      height={size}
      width={size}
      onClick={onClick}
      className="rounded-full"
      onMouseEnter={() => setIsMouseHovering(true)}
      onMouseLeave={() => setIsMouseHovering(false)}
    >
      <circle
        data-testid={testId}
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - borderWidth}
        stroke={borderColor}
        strokeDasharray={strokeDashArray}
        strokeWidth={borderWidth}
        fill={fillColor}
      />
      {(centerDot || isMouseHovering) && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={centerDotSize}
          fill={borderColor}
        />
      )}
    </svg>
  );
};

// Official examples used React.memo, see e.g.
// https://github.com/visgl/react-map-gl/blob/6.1-release/examples/controls/src/pins.js
export const Circle = memo(CircleComponent);
