import React from 'react';

interface Props {
  className?: string;
}

export const Card: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={`flex items-start rounded border bg-background p-2 shadow-md ${className}`}
    >
      {children}
    </div>
  );
};
