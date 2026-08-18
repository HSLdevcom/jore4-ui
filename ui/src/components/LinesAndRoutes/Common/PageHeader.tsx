import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type PageHeaderProps = {
  readonly className?: string;
};

export const PageHeader: FC<PropsWithChildren<PageHeaderProps>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={twMerge('border-b border-light-grey bg-background', className)}
    >
      <div className="container mx-auto py-10">{children}</div>
    </div>
  );
};
