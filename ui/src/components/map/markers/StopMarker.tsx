import { FC, MouseEventHandler, useEffect, useState } from 'react';
import { MapStop } from '../types';

type PromisedTitle =
  | { readonly title: string | null; readonly promise?: never }
  | {
      readonly promise: Promise<void>;
      readonly title?: never;
      readonly cancel: () => void;
    };

type StopMarkerBaseProps = {
  readonly testId?: string;
  readonly size?: number;
  readonly borderWidth?: number;
  readonly fillColor?: string;
  readonly borderColor?: string;
  readonly strokeDashArray?: number;
  readonly centerDot?: boolean;
  readonly centerDotSize?: number;
};

type ExistingStopMarkerSpecialProps = {
  readonly onClick: (stop: MapStop) => void;
  readonly onResolveTitle: (stop: MapStop) => Promise<string | null>;
  readonly stop: MapStop;
};

type ExistingStopMarkerSpecialPropsNever = {
  readonly [key in keyof ExistingStopMarkerSpecialProps]?: never;
};

type ExistingStopMarkerProps = StopMarkerBaseProps &
  ExistingStopMarkerSpecialProps;

type PlaceholderStopMarkerProps = StopMarkerBaseProps &
  ExistingStopMarkerSpecialPropsNever;

type StopMarkerProps = PlaceholderStopMarkerProps | ExistingStopMarkerProps;

export const StopMarker: FC<StopMarkerProps> = ({
  testId,
  size = 20,
  borderWidth = 2,
  fillColor = 'white',
  borderColor = 'black',
  strokeDashArray = 0,
  centerDot = false,
  centerDotSize = 2,
  onClick,
  onResolveTitle,
  stop,
}) => {
  const [isMouseHovering, setIsMouseHovering] = useState(false);
  const [promisedTitle, setPromisedTitle] = useState<PromisedTitle | null>(
    null,
  );

  useEffect(
    () => () =>
      setPromisedTitle((previous) => {
        if (previous && previous.promise) {
          previous.cancel();
        }

        return null;
      }),
    [onResolveTitle],
  );

  const onMouseEnter: MouseEventHandler<SVGSVGElement> = () => {
    setIsMouseHovering(true);

    if (promisedTitle === null && onResolveTitle) {
      let canceled = false;
      setPromisedTitle({
        promise: onResolveTitle(stop).then((title) => {
          if (!canceled) {
            setPromisedTitle({ title });
          }
        }),
        cancel: () => {
          canceled = true;
        },
      });
    }
  };

  const onMouseLeave: MouseEventHandler<SVGSVGElement> = () => {
    setIsMouseHovering(false);
  };

  return (
    <svg
      height={size}
      width={size}
      onClick={onClick ? () => onClick(stop) : undefined}
      className="cursor-pointer rounded-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {promisedTitle?.title ? <title>{promisedTitle.title}</title> : null}

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
