import { FC, PropsWithChildren } from 'react';

type ColumnProps = {
  readonly className?: string;
  readonly id?: string;
  readonly testId?: string;
};

export const Column: FC<PropsWithChildren<ColumnProps>> = ({
  className = '',
  id,
  children,
  testId,
}) => {
  return (
    <div id={id} className={`flex flex-col ${className}`} data-testid={testId}>
      {children}
    </div>
  );
};
