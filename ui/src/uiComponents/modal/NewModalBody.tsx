import { FunctionComponent } from 'react';

interface Props {
  className?: string;
}

export const NewModalBody: FunctionComponent<Props> = ({
  className = '',
  children,
}) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};
