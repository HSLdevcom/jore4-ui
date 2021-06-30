import React from 'react';

interface Props {
  className?: string;
}

export const Card: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={`bg-background flex items-start p-2 border rounded ${className}`}
    >
      {children}
    </div>
  );
};
