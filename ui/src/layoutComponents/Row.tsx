import React from 'react';

interface Props {
  className?: string;
  testId?: string;
}

export const Row: React.FC<React.PropsWithChildren<Props>> = ({
  className = '',
  children,
  testId = null,
}) => {
  return (
    <div className={`flex flex-row ${className}`} data-testid={testId}>
      {children}
    </div>
  );
};
