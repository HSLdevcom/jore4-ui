import React from 'react';

interface Props {
  className?: string;
  testId?: string;
}

export const RoutesTable: React.FC<Props> = ({
  className,
  testId,
  children,
}) => {
  return (
    <table className={`w-full ${className}`} data-testid={testId}>
      {children}
    </table>
  );
};
