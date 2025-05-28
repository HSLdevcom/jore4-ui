import { FC, PropsWithChildren } from 'react';

type RoutesTableProps = {
  readonly className?: string;
  readonly testId?: string;
};

export const RoutesTable: FC<PropsWithChildren<RoutesTableProps>> = ({
  className = '',
  testId,
  children,
}) => {
  return (
    // setting a fake "height: 1px" so that "height: 100%" would work for the table cells
    <table className={`h-1 w-full ${className}`} data-testid={testId}>
      <tbody>{children}</tbody>
    </table>
  );
};
