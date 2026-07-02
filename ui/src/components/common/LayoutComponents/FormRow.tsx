import { FC, PropsWithChildren } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

declare module 'react' {
  // Augment "style" prop to accept our CSS Variables
  interface CSSProperties {
    '--smGridColCount'?: string | number;
    '--mdGridColCount'?: string | number;
    '--lgGridColCount'?: string | number;
    '--xlGridColCount'?: string | number;
    '--xxlGridColCount'?: string | number;
  }
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
  className,
  mdColumns,
  xxlColumns,
  xlColumns,
  lgColumns,
  // For compatability with previous implementation.
  smColumns = mdColumns,
  children,
  testId,
}) => {
  return (
    <div
      className={twMerge(
        twJoin(
          'grid grid-cols-1 gap-y-5',
          Number.isFinite(xxlColumns) &&
            '2xl:grid-cols-[repeat(var(--xxlGridColCount),minmax(0,1fr))]',
          Number.isFinite(xlColumns) &&
            'xl:grid-cols-[repeat(var(--xlGridColCount),minmax(0,1fr))]',
          Number.isFinite(lgColumns) &&
            'lg:grid-cols-[repeat(var(--lgGridColCount),minmax(0,1fr))]',
          Number.isFinite(mdColumns) &&
            'md:grid-cols-[repeat(var(--mdGridColCount),minmax(0,1fr))] md:gap-x-8',
          Number.isFinite(smColumns) &&
            'sm:grid-cols-[repeat(var(--smGridColCount),minmax(0,1fr))] sm:gap-x-4',
        ),
        className,
      )}
      data-testid={testId}
      style={{
        '--xxlGridColCount': xxlColumns,
        '--xlGridColCount': xlColumns,
        '--lgGridColCount': lgColumns,
        '--mdGridColCount': mdColumns,
        '--smGridColCount': smColumns,
      }}
    >
      {children}
    </div>
  );
};
