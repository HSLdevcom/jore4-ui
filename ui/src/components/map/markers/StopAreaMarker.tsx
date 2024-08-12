import { MouseEventHandler } from 'react';

type StopAreaProps = {
  selected?: boolean;
  onClick?: MouseEventHandler<SVGElement>;
  size?: number;
  testId?: string;
};

export const StopAreaMarker = ({
  onClick,
  selected = false,
  size = 30,
  testId,
}: StopAreaProps) => {
  const strokeClassName = selected
    ? 'stroke-hsl-dark-80'
    : 'stroke-dark-grey hover:stroke-tweaked-brand';
  const subCircleClassName = selected ? 'fill-hsl-dark-80' : '';
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
      <circle className="fill-white" cx="14" cy="14" r="12.5" strokeWidth="3" />

      <g strokeWidth="2">
        <circle className={subCircleClassName} cx="18.763" cy="16.75" r="3" />
        <circle className={subCircleClassName} cx="9.237" cy="16.75" r="3" />
        <circle className={subCircleClassName} cx="14" cy="8.5" r="3" />
      </g>
    </svg>
  );
};
