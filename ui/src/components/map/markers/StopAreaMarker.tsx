import { degreesToRadians } from '@turf/helpers';
import { MouseEventHandler } from 'react';

const viewBoxSize = 28;
const viewBox = `0 0 ${viewBoxSize} ${viewBoxSize}`;

// Separated by 120°, with one circle on top.
// In SVG Y-axis goes down, so (30°+240°=270°) equals 90° on normal coordinate system.
const secondaryCirclesAtAngles = [30, 30 + 120, 30 + 240];

const primaryStrokeWidth = 3;
const secondaryStrokeWidth = primaryStrokeWidth - 1;

// Half of stroke goes on both sides of the actual circle drawn by R
const primaryCircleR = viewBoxSize / 2 - primaryStrokeWidth / 2;
const secondaryCircleR = 3;

const centerAt = viewBoxSize / 2;
const secondaryCircleDistance = // Small circle center's distance from primary circle's center
  // Offset by circle size, outer edge of stroke touches center.
  secondaryCircleR +
  secondaryStrokeWidth / 2 +
  // Magic number that makes them look nice
  1.5;

type StopAreaProps = {
  readonly selected?: boolean;
  readonly onClick?: MouseEventHandler<SVGElement>;
  readonly size?: number;
  readonly testId?: string;
};

export const StopAreaMarker = ({
  onClick,
  selected = false,
  size = viewBoxSize,
  testId,
}: StopAreaProps) => {
  const strokeClassName = selected
    ? 'stroke-black'
    : 'stroke-dark-grey hover:stroke-tweaked-brand';

  return (
    <svg
      data-testid={testId}
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      className={strokeClassName}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <circle
        className="fill-white"
        cx={centerAt}
        cy={centerAt}
        r={primaryCircleR}
        strokeWidth={primaryStrokeWidth}
      />

      {secondaryCirclesAtAngles.map((atAngle) => (
        <circle
          key={atAngle}
          cx={
            secondaryCircleDistance * Math.cos(degreesToRadians(atAngle)) +
            centerAt
          }
          cy={
            secondaryCircleDistance * Math.sin(degreesToRadians(atAngle)) +
            centerAt
          }
          r={secondaryCircleR}
          strokeWidth={secondaryStrokeWidth}
        />
      ))}
    </svg>
  );
};
