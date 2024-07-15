import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

interface Props {
  showSpinner: boolean;
  className?: string;
}

export const Spinner = ({
  showSpinner,
  className = '',
}: Props): React.ReactElement => {
  return (
    <div className={className}>
      <ClipLoader loading={showSpinner} />
    </div>
  );
};
