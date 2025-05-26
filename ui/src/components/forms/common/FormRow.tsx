import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type FormRowProps = {
  readonly className?: string;
  readonly lgColumns?: number;
  readonly mdColumns?: number;
  readonly smColumns?: number;
  readonly testId?: string;
};

export const FormRow: FC<PropsWithChildren<FormRowProps>> = ({
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
      className={twMerge(
        `${baseClassName} ${lgClassName} ${mdClassName} ${smClassName}`,
        className,
      )}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
