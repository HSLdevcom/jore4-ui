import React from 'react';

interface Props {
  className?: string;
}

export const Container: React.FC<Props> = ({ className = '', children }) => {
  return (
    <div className={`container mx-auto py-20 ${className}`}>{children}</div>
  );
};
