import React from 'react';

interface Props {
  className?: string;
  testId?: string;
}

export const Container: React.FC<Props> = ({
  className = '',
  testId,
  children,
}) => {
  return (
    <div
      className={`container mx-auto py-10 ${className}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
