import React from 'react';

interface Props {
  className?: string;
}

export const PageHeaderRow: React.FC<Props> = ({ className, children }) => {
  return (
    <div className="bg-background">
      <div className={`container mx-auto py-12 ${className}`}>{children}</div>
    </div>
  );
};
