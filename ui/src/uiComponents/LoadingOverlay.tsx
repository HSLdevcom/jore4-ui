import { Portal } from '@headlessui/react';
import { FC, useEffect, useRef, useState } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import { theme } from '../generated/theme';
// The index.ts can, and do here, cause a massive cyclic dependency loop.
// Use direct import
import { LoadingState } from '../redux/slices/loader';

// Make sure the loader doesn't simply flash on the screen for 1 frame.
// See also resolveTransitionTimeout fn down below
const HIDE_LOADER_DELAY = 200;
const MEDIUM_PRIO_LOADER_DELAY = 300;
const LOW_PRIO_LOADER_DELAY = 500;

type BaseProps = { readonly testId?: string };
type IsLoadingProps = { readonly isLoading: boolean; loadingState?: never };
type LoadingStateProps = {
  readonly isLoading?: never;
  readonly loadingState: LoadingState;
};

type LoadingOverlayProps = BaseProps & (IsLoadingProps | LoadingStateProps);

function resolveLoadingState(
  loadingState: LoadingState | undefined,
  isLoading: boolean | undefined,
): LoadingState {
  if (loadingState) {
    return loadingState;
  }

  return isLoading ? LoadingState.HighPriority : LoadingState.NotLoading;
}

function getBaseDelay(loadingState: LoadingState): number {
  switch (loadingState) {
    case LoadingState.NotLoading:
      return HIDE_LOADER_DELAY;

    case LoadingState.LowPriority:
      return LOW_PRIO_LOADER_DELAY;

    case LoadingState.MediumPriority:
      return MEDIUM_PRIO_LOADER_DELAY;

    default:
      return 0;
  }
}

function resolveTransitionTimeout(
  lastShown: number,
  loadingState: LoadingState,
): number {
  const baseDelay = getBaseDelay(loadingState);

  if (loadingState === LoadingState.NotLoading) {
    // No need for delay if the loader has already been on the screen for long enough.
    const onScreen = Date.now() - lastShown;
    return Math.max(0, baseDelay - onScreen);
  }

  return baseDelay;
}

function useIsVisible(
  loadingState: LoadingState | undefined,
  isLoading: boolean | undefined,
): boolean {
  const resolvedLoadingState = resolveLoadingState(loadingState, isLoading);

  const [visible, setVisible] = useState(
    resolvedLoadingState !== LoadingState.NotLoading,
  );
  const shownAt = useRef(visible ? Date.now() : 0);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const nextIsVisible = resolvedLoadingState !== LoadingState.NotLoading;
        setVisible(nextIsVisible);
        if (nextIsVisible) {
          shownAt.current = Date.now();
        }
      },
      resolveTransitionTimeout(shownAt.current, resolvedLoadingState),
    );

    return () => clearTimeout(timeout);
  }, [resolvedLoadingState]);

  return visible;
}

export const LoadingOverlay: FC<LoadingOverlayProps> = ({
  isLoading,
  loadingState,
  testId = '',
}) => {
  const visible = useIsVisible(loadingState, isLoading);

  if (!visible) {
    return null;
  }

  return (
    <Portal>
      <div
        className="fixed left-1/2 top-1/2 z-20 flex h-32 -translate-x-1/2 -translate-y-1/2 cursor-wait rounded border border-light-grey bg-background px-20 shadow-lg"
        data-testid={testId}
      >
        <PulseLoader
          color={theme.colors.brand}
          size={25}
          cssOverride={{ margin: 'auto auto' }}
          speedMultiplier={0.7}
        />
      </div>
    </Portal>
  );
};
