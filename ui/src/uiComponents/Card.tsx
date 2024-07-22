import React, { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

export const Card: FC<Props> = ({ className = '', children }) => {
  return (
    <div
      className={`flex items-start rounded border bg-background pb-4 pl-5 pr-6 pt-1.5 shadow-md ${className}`}
    >
      {children}
    </div>
  );
};
