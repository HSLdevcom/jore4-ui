import React from 'react';
import { Column } from '../../layoutComponents';

interface Props {
  className?: string;
  fieldName: string;
  value: string;
}

export const FieldValue = ({
  className,
  fieldName,
  value,
}: Props): JSX.Element => {
  return (
    <Column className={className}>
      <span className="text-3xl font-semibold">{value}</span>
      <span>{fieldName}</span>
    </Column>
  );
};
