import noop from 'lodash/noop';
import { FC, ReactNode, Suspense } from 'react';
import { PulseLoader } from 'react-spinners';
import { theme } from '../generated/theme';

interface Props {
  testId: string;
  loadingText?: string;
  className?: string;
  loading?: boolean;
  size?: number;
  color?: string;
  speedMultiplier?: number;
  children: ReactNode;
}

const Loader: FC<Omit<Props, 'children' | 'loading'>> = ({
  testId,
  loadingText,
  className,
  size = 25,
  color = theme.colors.brand,
  speedMultiplier = 0.7,
}) => (
  <div data-testid={testId} className={className}>
    <div className="inline-flex flex-col items-center">
      <PulseLoader
        color={color}
        size={size}
        speedMultiplier={speedMultiplier}
      />
      {loadingText && <span className="mt-4">{loadingText}</span>}
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
export const LoadingWrapper: FC<Props> = ({
  children,
  loading = true,
  ...loaderProps
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <Suspense fallback={<Loader {...loaderProps} />}>
    {loading ? <TriggerSuspense /> : <>{children}</>}
  </Suspense>
);
