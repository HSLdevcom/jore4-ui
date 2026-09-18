import { FC, MouseEventHandler, useEffect, useState } from 'react';
import { StopRegistryTransportModeType } from '../../../../generated/graphql';
import { theme } from '../../../../generated/theme';
import { MapStop } from '../../Types';

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
  readonly depotStopLabel?: string;
  readonly onDepotStopClick?: () => void;
  readonly transportModes?: ReadonlyArray<StopRegistryTransportModeType>;
  readonly trunkLine?: boolean;
  readonly speedTram?: boolean;
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

type MarkerInteraction = {
  readonly hoverTitle: string | undefined;
  readonly accessibleLabel: string | undefined;
  readonly onMarkerClick: (() => void) | undefined;
};

function resolveMarkerInteraction(
  stop: MapStop | undefined,
  onClick: ((stop: MapStop) => void) | undefined,
  promisedTitle: PromisedTitle | null,
  depotStopLabel: string | undefined,
  onDepotStopClick: (() => void) | undefined,
): MarkerInteraction {
  switch (true) {
    case !!stop:
      return {
        hoverTitle: promisedTitle?.title ?? undefined,
        accessibleLabel: stop.label,
        onMarkerClick: () => onClick?.(stop),
      };

    case !!depotStopLabel:
      return {
        hoverTitle: depotStopLabel,
        accessibleLabel: depotStopLabel,
        onMarkerClick: onDepotStopClick,
      };

    default:
      return {
        hoverTitle: undefined,
        accessibleLabel: undefined,
        onMarkerClick: undefined,
      };
  }
}

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
  depotStopLabel,
  onDepotStopClick,
  transportModes = [],
  trunkLine = false,
  speedTram = false,
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

  const dimension = inSelection ? 34 : 26;

  const { hoverTitle, accessibleLabel, onMarkerClick } =
    resolveMarkerInteraction(
      stop,
      onClick,
      promisedTitle,
      depotStopLabel,
      onDepotStopClick,
    );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      className="flex cursor-pointer items-center rounded-full"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={hoverTitle}
      onClick={onMarkerClick}
      aria-label={accessibleLabel}
      data-testid={testId}
      data-transport-modes={transportModes.join(',')}
      data-trunk-line={trunkLine}
      data-speed-tram={speedTram}
    >
      <svg
        data-testid={testIds.icon}
        height={dimension}
        width={dimension}
        className="overflow-visible p-[6px]"
        viewBox="0 0 14 14"
      >
        <circle
          cx={7}
          cy={7}
          r={6}
          stroke={inSelection ? 'white' : borderColor}
          strokeDasharray={strokeDashArray}
          strokeWidth={inSelection ? 1.5 : 1}
          fill={inSelection ? borderColor : fillColor}
        />

        {inSelection && (
          <circle
            cx={7}
            cy={7}
            r={7.5}
            stroke={borderColor}
            strokeWidth={2}
            fill="none"
          />
        )}

        {secondaryFillColor && (
          <path fill={secondaryFillColor} d="M 7 1 A 6 6 0 0 1 7 13 Z" />
        )}

        {!inSelection && centerDot && (
          <circle cx={7} cy={7} r={3} fill={borderColor} />
        )}

        {isMouseHovering && (
          <circle
            cx={7}
            cy={7}
            r={8}
            stroke={theme.colors.hslDark80}
            strokeWidth={1}
            fill="none"
          />
        )}

        {inSelection && (
          <path
            transform="translate(7 7) scale(0.65) translate(-7 -7)"
            fillRule="evenodd"
            d="M 9.834,3.799 5.851,7.78 4.128,6.057 C 3.758,5.688 3.211,5.675 2.829,6.018 L 2.787,6.057 C 2.404,6.44 2.404,7.014 2.787,7.397 L 5.851,10.46 11.213,5.139 C 11.582,4.77 11.595,4.222 11.252,3.841 L 11.213,3.799 C 10.791,3.454 10.217,3.454 9.834,3.799 Z"
            fill="white"
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
