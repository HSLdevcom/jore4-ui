import React, { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  testId?: string;
  tooltip?: string;
  identifier?: string;
  children: ReactNode;
}

export const Row: FC<Props> = ({
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
