import React, { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  testId?: string;
  children: ReactNode;
}

export const RoutesTable: FC<Props> = ({
  className = '',
  testId,
  children,
}) => {
  return (
    // setting a fake "height: 1px" so that "height: 100%" would work for the table cells
    <table className={`h-1 w-full ${className}`} data-testid={testId}>
      <tbody>{children}</tbody>
    </table>
  );
};
