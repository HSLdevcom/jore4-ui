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
  // flex flex-col items-start space-y-5 md:flex-row md:items-center md:space-x-8 md:space-y-0
  const narrowClassName = 'grid grid-cols-1 gap-y-5';
  const wideClassName = `md:grid-cols-${columns} md:gap-x-8`;
  return (
    <div className={`${className} ${narrowClassName} ${wideClassName}`}>
      {children}
    </div>
  );
};
