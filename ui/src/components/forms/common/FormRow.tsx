import React from 'react';

interface Props {
  className?: string;
  mdColumns?: number;
  smColumns?: number;
  testId?: string;
}

export const FormRow: React.FC<Props> = ({
  className = '',
  mdColumns = 1,
  smColumns = mdColumns,
  children,
  testId,
}) => {
  const baseClassName = 'grid grid-cols-1 gap-y-5';
  const mdClassName = `md:grid-cols-${mdColumns} md:gap-x-8`;
  const smClassName = `sm:grid-cols-${smColumns} sm:gap-x-4`;
  return (
    <div
      className={`${className} ${baseClassName} ${mdClassName} ${smClassName}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
