import React from 'react';

interface Props {
  className?: string;
  columns?: number;
}

export const FormRow: React.FC<Props> = ({
  className = '',
  columns = 1,
  children,
}) => {
  const narrowClassName = 'grid grid-cols-1 gap-y-5';
  const wideClassName = `md:grid-cols-${columns} md:gap-x-8`;
  return (
    <div className={`${className} ${narrowClassName} ${wideClassName}`}>
      {children}
    </div>
  );
};
