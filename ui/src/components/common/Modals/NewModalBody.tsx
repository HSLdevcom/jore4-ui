import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type NewModalBodyProps = {
  readonly className?: string;
};

export const NewModalBody: FC<PropsWithChildren<NewModalBodyProps>> = ({
  className,
  children,
}) => {
  return <div className={twMerge('p-5', className)}>{children}</div>;
};
