import { FC, MouseEventHandler, useEffect, useState } from 'react';
import { MapStop } from '../types';

const testIds = {
  icon: 'Map::Stops::stopMarker::Icon',
  label: 'Map::Stops::stopMarker::Label',
};

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
  readonly secondaryFillColor?: string | null;
  readonly borderColor?: string;
  readonly strokeDashArray?: number;
  readonly centerDot?: boolean;
  readonly inSelection?: boolean;
  readonly showLabel?: boolean;
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
  fillColor = 'white',
  secondaryFillColor = null,
  borderColor = 'black',
  strokeDashArray = 0,
  centerDot = false,
  inSelection = false,
  onClick,
  onResolveTitle,
  stop,
  showLabel = false,
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

  const onMouseEnter: MouseEventHandler<HTMLDivElement> = () => {
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

  const onMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    setIsMouseHovering(false);
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className="flex cursor-pointer items-center rounded-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={promisedTitle?.title ?? undefined}
      onClick={onClick ? () => onClick(stop) : undefined}
      aria-label={stop?.label}
      data-testid={testId}
    >
      <svg
        data-testid={testIds.icon}
        height={26}
        width={26}
        className="p-[6px]"
        viewBox="0 0 14 14"
      >
        <circle
          cx={7}
          cy={7}
          r={6}
          stroke={borderColor}
          strokeDasharray={strokeDashArray}
          strokeWidth={1}
          fill={fillColor}
        />

        {secondaryFillColor && (
          <path fill={secondaryFillColor} d="M 7 1 A 6 6 0 0 1 7 13 Z" />
        )}

        {!inSelection && (centerDot || isMouseHovering) && (
          <circle cx={7} cy={7} r={3} fill={borderColor} />
        )}

        {inSelection && (
          <path
            fillRule="evenodd"
            d="M 9.834,3.799 5.851,7.78 4.128,6.057 C 3.758,5.688 3.211,5.675 2.829,6.018 L 2.787,6.057 C 2.404,6.44 2.404,7.014 2.787,7.397 L 5.851,10.46 11.213,5.139 C 11.582,4.77 11.595,4.222 11.252,3.841 L 11.213,3.799 C 10.791,3.454 10.217,3.454 9.834,3.799 Z"
            fill={borderColor}
          />
        )}
      </svg>

      {showLabel && stop && (
        <p
          aria-hidden
          data-testid={testIds.label}
          className="rounded border border-border-weak bg-white/50 px-1 text-[10px] text-dark-grey"
        >
          {stop.label}
        </p>
      )}
    </div>
  );
};
