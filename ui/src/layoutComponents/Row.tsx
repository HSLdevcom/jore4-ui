import React from 'react';

interface Props {
  className?: string;
}

export const Row: React.FC<Props> = ({ className, children }) => {
  return <div className={`flex flex-row ${className}`}>{children}</div>;
};
