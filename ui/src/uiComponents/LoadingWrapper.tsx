import { FunctionComponent } from 'react';
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
}

/**
 * This loading wrapper will render a React spinner if the loading parameter is true,
 * but it will render the children if the loading parameter is false. So you can wrap the
 * elements that need to be hidden during the loading with this, hence the name.
 * There is also an optional loading text below the spinner.
 */
export const LoadingWrapper: FunctionComponent<Props> = ({
  testId,
  children,
  loadingText,
  className,
  loading = true,
  size = 25,
  color = theme.colors.brand,
  speedMultiplier = 0.7,
}) => {
  if (loading) {
    return (
      <div data-testid={testId} className={className}>
        <div className="inline-flex flex-col items-center">
          <PulseLoader
            color={color}
            size={size}
            speedMultiplier={speedMultiplier}
          />
          {loadingText && <span>{loadingText}</span>}
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
