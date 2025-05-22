import React, { FC, PropsWithChildren } from 'react';

type RowProps = {
  readonly className?: string;
  readonly testId?: string;
  readonly tooltip?: string;
  readonly identifier?: string;
};

export const Row: FC<PropsWithChildren<RowProps>> = ({
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
