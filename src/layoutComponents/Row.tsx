import React from 'react';

interface Props {
  className?: string;
  testId?: string;
}

export const Row: React.FC<Props> = ({ className, children, testId }) => {
  if (testId) {
    return <div className={`flex flex-row ${className}`} data-testId={`${testId}`}>{children}</div>;  
  }
  return <div className={`flex flex-row ${className}`}>{children}</div>;
};
