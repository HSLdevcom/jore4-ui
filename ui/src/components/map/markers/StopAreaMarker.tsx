import { FC, MouseEventHandler, useState } from 'react';
import { theme } from '../../../generated/theme';

type StopAreaMarkerProps = {
  readonly selected?: boolean;
  readonly isPlaceholder?: boolean;
  readonly onClick?: MouseEventHandler<SVGElement>;
  readonly size?: number;
  readonly testId?: string;
  readonly title?: string;
  readonly color?: string;
};

export const StopAreaMarker: FC<StopAreaMarkerProps> = ({
  onClick,
  selected = false,
  isPlaceholder = false,
  size = 28,
  testId,
  title,
  color = theme.colors.tweakedBrand,
}) => {
  const strokeClassName =
    selected && !isPlaceholder
      ? 'cursor-pointer stroke-hsl-dark-80'
      : 'cursor-pointer stroke-dark-grey hover:stroke-tweaked-brand';
  const selectedSize = size + 2;

  const [isMouseHovering, setIsMouseHovering] = useState(false);

  const onMouseEnter: MouseEventHandler<SVGSVGElement> = () => {
    setIsMouseHovering(true);
  };

  const onMouseLeave: MouseEventHandler<SVGSVGElement> = () => {
    setIsMouseHovering(false);
  };

  const ellipseStroke = isMouseHovering ? '#0062A1' : '#333333';

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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {title ? <title>{title}</title> : null}

      <circle cx="13.75" cy="13.75" r="12.75" stroke={color} strokeWidth="2" />
      {selected || isMouseHovering ? (
        <>
          <ellipse
            cx="13.9062"
            cy="14"
            rx="6.90625"
            ry="7"
            fill="white"
            stroke="#003456"
          />
          <ellipse
            cx="13.9062"
            cy="14"
            rx="6.90625"
            ry="7"
            fill="white"
            stroke={ellipseStroke}
          />
          <ellipse
            cx="11.9312"
            cy="15"
            rx="0.53125"
            ry="0.5"
            fill={ellipseStroke}
            stroke={ellipseStroke}
            strokeWidth="2"
          />
          <ellipse
            cx="15.9312"
            cy="15"
            rx="0.53125"
            ry="0.5"
            fill={ellipseStroke}
            stroke={ellipseStroke}
            strokeWidth="2"
          />
          <ellipse
            cx="0.53125"
            cy="0.5"
            rx="0.53125"
            ry="0.5"
            transform="matrix(-1 0 0 1 14.4625 11.5)"
            fill={ellipseStroke}
            stroke={ellipseStroke}
            strokeWidth="2"
          />
        </>
      ) : (
        <ellipse
          cx="13.9062"
          cy="14"
          rx="6.90625"
          ry="7"
          fill="white"
          stroke="#333333"
        />
      )}
    </svg>
  );
};
