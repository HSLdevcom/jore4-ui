import { PulseLoader } from 'react-spinners';
import { theme } from '../../../generated/theme';

interface Props {
  className?: string;
}

export const RouteRowLoader = ({ className = '' }: Props): JSX.Element => {
  return (
    <div
      className={`mt-1 inline-flex min-h-16 w-full flex-col items-center justify-center bg-lighter-grey ${className}`}
    >
      <PulseLoader size={15} color={theme.colors.brand} speedMultiplier={0.7} />
    </div>
  );
};
