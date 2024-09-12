import React, { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  lgColumns?: number;
  mdColumns?: number;
  smColumns?: number;
  testId?: string;
  children: ReactNode;
}

export const FormRow: FC<Props> = ({
  className = '',
  mdColumns = 1,
  lgColumns = mdColumns,
  smColumns = mdColumns,
  children,
  testId,
}) => {
  const baseClassName = 'grid grid-cols-1 gap-y-5';

  const lgClassName = `lg:grid-cols-${lgColumns} lg:gap-x-8`;
  const mdClassName = `md:grid-cols-${mdColumns} md:gap-x-8`;
  const smClassName = `sm:grid-cols-${smColumns} sm:gap-x-4`;

  return (
    <div
      className={`${className} ${baseClassName} ${lgClassName} ${mdClassName} ${smClassName}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
