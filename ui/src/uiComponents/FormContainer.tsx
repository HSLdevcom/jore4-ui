import React from 'react';

interface Props {
  className?: string;
}

export const FormContainer: React.FC<React.PropsWithChildren<Props>> = ({
  className = '',
  children,
}) => {
  return (
    <div
      className={`rounded-md border border-light-grey bg-background ${className}`}
    >
      {children}
    </div>
  );
};
