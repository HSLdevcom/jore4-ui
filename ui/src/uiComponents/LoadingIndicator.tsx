import React from 'react';

interface Props {
  testId?: string;
  className?: string;
}

export const LoadingIndicator: React.FC<Props> = ({
  testId,
  className = '',
}) => {
  return (
    <div data-testid={testId} className={className}>
      <div className="loading-indicator" />
    </div>
  );
};
