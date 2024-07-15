import React, { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

export const PageHeader: FC<Props> = ({ className = '', children }) => {
  return (
    <div className={`border-b border-light-grey bg-background ${className}`}>
      <div className="container mx-auto py-10">{children}</div>
    </div>
  );
};
