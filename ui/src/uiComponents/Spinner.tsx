import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

interface Props {
  showSpinner: boolean;
  className?: string;
}

export const Spinner = ({
  showSpinner,
  className = '',
}: Props): JSX.Element => {
  return (
    <div className={className}>
      <ClipLoader loading={showSpinner} />
    </div>
  );
};
