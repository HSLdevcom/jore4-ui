import React from 'react';

interface Props {
  className?: string;
}

export const PageHeader: React.FC<React.PropsWithChildren<Props>> = ({
  className = '',
  children,
}) => {
  return (
    <div className={`border-b border-light-grey bg-background ${className}`}>
      <div className="container mx-auto py-10">{children}</div>
    </div>
  );
};
