import React from 'react';

interface Props {
  className?: string;
}

export const FormContainer: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={`rounded-md border border-light-grey bg-background ${
        className || ''
      }`}
    >
      {children}
    </div>
  );
};
