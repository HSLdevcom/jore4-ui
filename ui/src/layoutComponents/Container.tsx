import { FC, PropsWithChildren } from 'react';

type ContainerProps = {
  readonly className?: string;
  readonly testId?: string;
};

export const Container: FC<PropsWithChildren<ContainerProps>> = ({
  className = '',
  testId,
  children,
}) => {
  return (
    <div
      className={`container mx-auto py-10 ${className}`}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
