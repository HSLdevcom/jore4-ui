import { FC, ReactNode } from 'react';

interface Props {
  className?: string;
  children: ReactNode;
}

export const NewModalBody: FC<Props> = ({ className = '', children }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};
