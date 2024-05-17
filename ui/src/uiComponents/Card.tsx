import React from 'react';

interface Props {
  className?: string;
}

export const Card: React.FC<Props> = ({ className = '', children }) => {
  return (
    <div
      className={`flex items-start rounded border bg-background pb-4 pl-5 pr-6 pt-1.5 shadow-md ${className}`}
    >
      {children}
    </div>
  );
};
