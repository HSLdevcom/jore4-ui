import { FC, PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type ModalBodyProps = {
  readonly className?: string;
};

export const ModalBody: FC<PropsWithChildren<ModalBodyProps>> = ({
  className,
  children,
}) => {
  return <div className={twMerge('mx-12 my-8', className)}>{children}</div>;
};
