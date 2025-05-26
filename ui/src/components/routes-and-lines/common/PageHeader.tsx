import { FC, PropsWithChildren } from 'react';

type PageHeaderProps = {
  readonly className?: string;
};

export const PageHeader: FC<PropsWithChildren<PageHeaderProps>> = ({
  className = '',
  children,
}) => {
  return (
    <div className={`border-b border-light-grey bg-background ${className}`}>
      <div className="container mx-auto py-10">{children}</div>
    </div>
  );
};
