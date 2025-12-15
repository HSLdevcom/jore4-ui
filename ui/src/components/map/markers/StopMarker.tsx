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
  readonly inSelection?: boolean;
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
  inSelection = false,
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

  const normalizationFactor = size / 40;
  const normalizedBorderWidth = normalizationFactor * borderWidth;
  const normalizedCenterDotSize = normalizationFactor * centerDotSize;

  return (
    <svg
      height={size}
      width={size}
      viewBox="0 0 40 40"
      onClick={onClick ? () => onClick(stop) : undefined}
      className="cursor-pointer rounded-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {promisedTitle?.title ? <title>{promisedTitle.title}</title> : null}

      <circle
        data-testid={testId}
        cx={20}
        cy={20}
        r={20 - normalizedBorderWidth}
        stroke={borderColor}
        strokeDasharray={strokeDashArray}
        strokeWidth={normalizedBorderWidth}
        fill={fillColor}
      />
      {!inSelection && (centerDot || isMouseHovering) && (
        <circle
          cx={20}
          cy={20}
          r={normalizedCenterDotSize}
          fill={borderColor}
        />
      )}

      {inSelection && (
        <path
          fillRule="evenodd"
          d="M 20,10 C 25.5228,10 30,14.4772 30,20 30,25.5228 25.5228,30 20,30 14.4772,30 10,25.5228 10,20 10,14.4772 14.4772,10 20,10 Z M 23.6424,15.8132 18.4867,20.9666 16.2559,18.7368 C 15.7778,18.2589 15.0693,18.2419 14.5748,18.6856 L 14.5207,18.7368 C 14.025,19.2323 14.025,19.9756 14.5207,20.4711 L 18.4867,24.4353 25.4271,17.5475 C 25.9052,17.0697 25.9222,16.3615 25.4783,15.8672 L 25.4271,15.8132 C 24.8818,15.3672 24.1382,15.3672 23.6424,15.8132Z"
          fill={borderColor}
        />
      )}
    </svg>
  );
};
