import React from 'react';

interface Props {
  containerClassName?: string;
  className?: string;
}

export const PageHeader: React.FC<Props> = ({
  containerClassName = '',
  className = '',
  children,
}) => {
  return (
    <div
      className={`border-b border-light-grey bg-background ${containerClassName}`}
    >
      <div className={`container mx-auto py-10 ${className}`}>{children}</div>
    </div>
  );
};
