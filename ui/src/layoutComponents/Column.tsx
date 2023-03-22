import React from 'react';

interface Props {
  className?: string;
}

export const Column: React.FC<React.PropsWithChildren<Props>> = ({
  className = '',
  children,
}) => {
  return <div className={`flex flex-col ${className}`}>{children}</div>;
};
