import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type ContainerType = 'fluid' | 'jumpy';

type ContainerProps = {
  readonly className?: string;
  readonly testId?: string;
  readonly type?: ContainerType;
};

export const Container: FC<PropsWithChildren<ContainerProps>> = ({
  children,
  className,
  testId,
  type = 'jumpy',
}) => {
  return (
    <div
      className={twMerge(
        type === 'fluid'
          ? 'mx-auto px-5 py-10 2xl:max-w-[96rem]'
          : 'container mx-auto py-10',
        className,
      )}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
