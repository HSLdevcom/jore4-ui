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
    <table className={`w-full ${className}`} data-testid={testId}>
      {children}
    </table>
  );
};
