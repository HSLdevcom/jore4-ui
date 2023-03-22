import React from 'react';

interface Props {
  className?: string;
  testId?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({
  className = '',
  testId,
  children,
}) => {
  return (
    <div
      className={`container mx-auto py-20 ${className}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
