import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type ColumnProps = {
  readonly className?: string;
  readonly id?: string;
  readonly testId?: string;
};

export const Column: FC<PropsWithChildren<ColumnProps>> = ({
  className,
  id,
  testId,
  children,
}) => {
  return (
    <div
      id={id}
      data-testid={testId}
      className={twMerge('flex flex-col', className)}
    >
      {children}
    </div>
  );
};
