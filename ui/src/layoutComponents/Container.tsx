import React, { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  testId?: string;
  children: ReactNode;
}

export const Container: FC<Props> = ({ className = '', testId, children }) => {
  return (
    <div
      className={`container mx-auto py-10 ${className}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
