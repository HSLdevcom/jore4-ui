import { FC, PropsWithChildren } from 'react';

type ColumnProps = {
  readonly className?: string;
  readonly id?: string;
};

export const Column: FC<PropsWithChildren<ColumnProps>> = ({
  className = '',
  id,
  children,
}) => {
  return (
    <div id={id} className={`flex flex-col ${className}`}>
      {children}
    </div>
  );
};
