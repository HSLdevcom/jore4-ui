import React from 'react';

interface Props {
  className?: string;
  testId?: string;
  tooltip?: string;
  identifier?: string;
}

export const Row: React.FC<Props> = ({
  className = '',
  children,
  testId = null,
  tooltip = '',
  identifier,
}) => {
  return (
    <div
      className={`flex flex-row ${className}`}
      title={tooltip}
      data-testid={testId}
      id={identifier}
    >
      {children}
    </div>
  );
};
