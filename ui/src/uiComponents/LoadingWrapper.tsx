import noop from 'lodash/noop';
import { FC, PropsWithChildren, ReactNode, Suspense } from 'react';
import { PulseLoader } from 'react-spinners';
import { twJoin } from 'tailwind-merge';
import { theme } from '../generated/theme';

type LoadingWrapperProps = {
  readonly testId: string;
  readonly loadingText?: ReactNode;
  readonly className?: string;
  readonly loading?: boolean;
  readonly size?: number;
  readonly color?: string;
  readonly speedMultiplier?: number;
  readonly orientation?: 'column' | 'row';
};

const Loader: FC<Omit<LoadingWrapperProps, 'loading'>> = ({
  testId,
  loadingText,
  className,
  size = 25,
  color = theme.colors.brand,
  speedMultiplier = 0.7,
  orientation = 'column',
}) => (
  <div data-testid={testId} className={className}>
    <div
      className={twJoin(
        'inline-flex items-center',
        orientation === 'column' ? 'flex-col' : '',
      )}
    >
      <PulseLoader
        color={color}
        size={size}
        speedMultiplier={speedMultiplier}
      />
      {loadingText && (
        <span className={orientation === 'column' ? 'mt-4' : 'ml-4'}>
          {loadingText}
        </span>
      )}
    </div>
  </div>
);

// A component that simply triggers the React suspense
const TriggerSuspense: FC = () => {
  throw new Promise(noop);
};

/**
 * This loading wrapper will render a React spinner if the loading parameter is true,
 * or if a React Suspense is triggered from some child component.
 * Otherwise, renders the children. So you can wrap the elements that need to be
 * hidden during the loading with this, hence the name.
 * There is also an optional loading text below the spinner.
 */
export const LoadingWrapper: FC<PropsWithChildren<LoadingWrapperProps>> = ({
  children,
  loading = true,
  ...loaderProps
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Suspense fallback={<Loader {...loaderProps} />}>
    {loading ? <TriggerSuspense /> : children}
  </Suspense>
);
