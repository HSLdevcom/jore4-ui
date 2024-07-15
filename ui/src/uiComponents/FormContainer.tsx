import React, { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

export const FormContainer: FC<Props> = ({ className = '', children }) => {
  return (
    <div
      className={`rounded-md border border-light-grey bg-background ${className}`}
    >
      {children}
    </div>
  );
};
