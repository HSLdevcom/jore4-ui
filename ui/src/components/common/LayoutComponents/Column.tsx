import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type ColumnProps = {
  readonly className?: string;
  readonly id?: string;
};

export const Column: FC<PropsWithChildren<ColumnProps>> = ({
  className,
  id,
  children,
}) => {
  return (
    <div id={id} className={twMerge('flex flex-col', className)}>
      {children}
    </div>
  );
};
