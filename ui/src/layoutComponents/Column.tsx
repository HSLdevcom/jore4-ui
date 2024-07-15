import React, { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  id?: string;
  children: ReactNode;
}

export const Column: FC<Props> = ({ className = '', id, children }) => {
  return (
    <div id={id} className={`flex flex-col ${className}`}>
      {children}
    </div>
  );
};
