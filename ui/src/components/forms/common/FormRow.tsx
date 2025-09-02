import { FC, PropsWithChildren } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

function genColClasses(
  typeClass: string,
  cols: number | undefined,
  extraClasses: string = '',
): string {
  if (Number.isFinite(cols)) {
    return `${typeClass}:grid-cols-${cols} ${extraClasses}`;
  }

  return extraClasses;
}

type FormRowProps = {
  readonly className?: string;
  readonly xxlColumns?: number;
  readonly xlColumns?: number;
  readonly lgColumns?: number;
  readonly mdColumns?: number;
  readonly smColumns?: number;
  readonly testId?: string;
};

export const FormRow: FC<PropsWithChildren<FormRowProps>> = ({
  className = '',
  mdColumns,
  xxlColumns,
  xlColumns,
  lgColumns,
  // For compatability with previous implementation.
  smColumns = mdColumns,
  children,
  testId,
}) => {
  const baseClassName = 'grid grid-cols-1 gap-y-5';

  const xxlClassName = genColClasses('2xl', xxlColumns);
  const xlClassName = genColClasses('xl', xlColumns);
  const lgClassName = genColClasses('lg', lgColumns);
  const mdClassName = genColClasses('md', mdColumns, 'md:gap-x-8');
  const smClassName = genColClasses('sm', smColumns, 'sm:gap-x-4');

  return (
    <div
      className={twMerge(
        twJoin(
          baseClassName,
          xxlClassName,
          xlClassName,
          lgClassName,
          mdClassName,
          smClassName,
        ),
        className,
      )}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
