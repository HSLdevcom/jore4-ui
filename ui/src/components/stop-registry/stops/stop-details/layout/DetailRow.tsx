import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type DetailRowProps = PropsWithChildren & {
  readonly className?: string;
  readonly testId?: string;
};

export const DetailRow: FC<DetailRowProps> = ({
  children,
  className,
  testId,
}) => {
  return (
    <div
      className={twMerge('mb-1 flex flex-row gap-8 py-2', className)}
      data-testid={testId}
    >
      {children}
    </div>
  );
};
