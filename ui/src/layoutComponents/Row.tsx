import React from 'react';

interface Props {
  className?: string;
  testId?: string;
  tooltip?: string;
}

export const Row: React.FC<Props> = ({
  className = '',
  children,
  testId = null,
  tooltip = '',
}) => {
  return (
    <div
      className={`flex flex-row ${className}`}
      title={tooltip}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
