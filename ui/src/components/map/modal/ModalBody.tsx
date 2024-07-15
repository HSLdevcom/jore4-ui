import { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

export const ModalBody: FC<Props> = ({ className = '', children }) => {
  return <div className={`mx-12 my-8 ${className}`}>{children}</div>;
};
