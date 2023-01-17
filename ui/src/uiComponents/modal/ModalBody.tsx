import { FunctionComponent } from 'react';

interface Props {
  className?: string;
}

export const ModalBody: FunctionComponent<Props> = ({
  className = '',
  children,
}) => {
  return <div className={`mx-12 my-8 ${className}`}>{children}</div>;
};
