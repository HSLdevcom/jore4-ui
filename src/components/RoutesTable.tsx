import React, { ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
  testId?: string;
}

export const RoutesTable = ({
  className,
  children,
  testId,
}: Props): JSX.Element => {
  return (
    // setting a fake "height: 1px" so that "height: 100%" would work for the table cells
    <table className={`h-1 w-full ${className}`} data-testid={testId}>
      {children}
    </table>
  );
};
