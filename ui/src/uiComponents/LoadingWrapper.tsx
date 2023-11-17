import { FunctionComponent } from 'react';
import { PulseLoader } from 'react-spinners';
import { theme } from '../generated/theme';

interface Props {
  loadingText?: string;
  className?: string;
  size?: number;
  color?: string;
  loading?: boolean;
  speedMultiplier?: number;
  testId: string;
}

/**
 * This loading wrapper will render a react spinner if the loading parameter is true,
 * but it will render the children if the loading parameter is false. So you can wrap the
 * elements that needs to be hidden during the loading with this, hence the name.
 * There is also an optional loading text below the spinner.
 *
 * Example:
 * <LoadingWrapper loading={searchResultsAreLoading} testId={testIds.foo}>
 *   <SearchResults results={searchResults}/>
 * </LoadingWrapper>
 *
 * But this can also be used without any wrapping.
 * <LoadingWrapper testId={testIds.bar} />
 */
export const LoadingWrapper: FunctionComponent<Props> = ({
  loadingText,
  className,
  children,
  size = 25,
  loading = true,
  color = theme.colors.brand,
  speedMultiplier = 0.7,
  testId,
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
