import React from 'react';
import { Column } from '../../../layoutComponents';

interface Props {
  className?: string;
  id?: string;
}

export const FormColumn: React.FC<Props> = ({
  className = '',
  id,
  children,
}) => {
  return (
    <Column className={`${className} w-full space-y-5`} id={id}>
      {children}
    </Column>
  );
};
