import { FC, PropsWithChildren } from 'react';

type NewModalBodyProps = {
  readonly className?: string;
};

export const NewModalBody: FC<PropsWithChildren<NewModalBodyProps>> = ({
  className = '',
  children,
}) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};
