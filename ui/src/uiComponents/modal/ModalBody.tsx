import { FC, PropsWithChildren } from 'react';

type ModalBodyProps = {
  readonly className?: string;
};

export const ModalBody: FC<PropsWithChildren<ModalBodyProps>> = ({
  className = '',
  children,
}) => {
  return <div className={`mx-12 my-8 ${className}`}>{children}</div>;
};
