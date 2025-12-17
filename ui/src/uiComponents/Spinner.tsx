import { FC } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

type SpinnerProps = {
  readonly showSpinner: boolean;
  readonly className?: string;
};

export const Spinner: FC<SpinnerProps> = ({ showSpinner, className }) => {
  return (
    <div className={className}>
      <ClipLoader loading={showSpinner} />
    </div>
  );
};
