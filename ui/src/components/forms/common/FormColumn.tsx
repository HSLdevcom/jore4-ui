import React from 'react';
import { Column } from '../../../layoutComponents';

interface Props {
  className?: string;
}

export const FormColumn: React.FC<Props> = ({ className = '', children }) => {
  return <Column className={`${className} space-y-5`}>{children}</Column>;
};
