import React from 'react';

interface Props {
  className?: string;
  id?: string;
}

export const Column: React.FC<Props> = ({ className = '', id, children }) => {
  return (
    <div id={id} className={`flex flex-col ${className}`}>
      {children}
    </div>
  );
};
