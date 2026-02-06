import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type ContainerProps = {
  readonly className?: string;
  readonly testId?: string;
};

export const Container: FC<PropsWithChildren<ContainerProps>> = ({
  className,
  testId,
  children,
}) => {
  return (
    <div
      className={twMerge('mx-auto px-5 py-10 2xl:max-w-[96rem]', className)}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
