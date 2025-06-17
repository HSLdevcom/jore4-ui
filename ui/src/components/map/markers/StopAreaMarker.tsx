import { FC, MouseEventHandler } from 'react';

type StopAreaMarkerProps = {
  readonly selected?: boolean;
  readonly isPlaceholder?: boolean;
  readonly onClick?: MouseEventHandler<SVGElement>;
  readonly size?: number;
  readonly testId?: string;
};

export const StopAreaMarker: FC<StopAreaMarkerProps> = ({
  onClick,
  selected = false,
  isPlaceholder = false,
  size = 30,
  testId,
}) => {
  const strokeClassName =
    selected && !isPlaceholder
      ? 'cursor-pointer stroke-hsl-dark-80'
      : 'cursor-pointer stroke-dark-grey hover:stroke-tweaked-brand';
  const subCircleClassName =
    selected && !isPlaceholder ? 'fill-hsl-dark-80' : '';
  const selectedSize = size + 2;

  return (
    <svg
      data-testid={testId}
      width={selected ? selectedSize : size}
      height={selected ? selectedSize : size}
      viewBox="0 0 28 28"
      fill="none"
      className={strokeClassName}
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <circle
        className="fill-white"
        cx="14"
        cy="14"
        r="12.5"
        strokeWidth="3"
        strokeDasharray={isPlaceholder ? 2 : 0}
      />

      <g strokeWidth="2">
        <circle className={subCircleClassName} cx="18.763" cy="16.75" r="3" />
        <circle className={subCircleClassName} cx="9.237" cy="16.75" r="3" />
        <circle className={subCircleClassName} cx="14" cy="8.5" r="3" />
      </g>
    </svg>
  );
};
