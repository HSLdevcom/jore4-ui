import { FC, PropsWithChildren } from 'react';

type RowProps = {
  readonly className?: string;
  readonly testId?: string;
  readonly tooltip?: string;
  readonly identifier?: string;
  readonly role?: string;
};

export const Row: FC<PropsWithChildren<RowProps>> = ({
  className = '',
  children,
  testId = null,
  tooltip = '',
  identifier,
  role,
}) => {
  return (
    <div
      className={`flex flex-row ${className}`}
      title={tooltip}
      data-testid={testId}
      id={identifier}
      role={role}
    >
      {children}
    </div>
  );
};
