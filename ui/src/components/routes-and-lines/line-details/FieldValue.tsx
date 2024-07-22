import React from 'react';
import { Column } from '../../../layoutComponents';

interface Props {
  className?: string;
  fieldName: string;
  value?: string;
  testId?: string;
}

export const FieldValue = ({
  className = '',
  fieldName,
  value,
  testId,
}: Props): React.ReactElement => {
  return (
    <Column className={className}>
      <span className="text-3xl font-semibold" data-testid={testId}>
        {
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          value || '-'
        }
      </span>
      <span>{fieldName}</span>
    </Column>
  );
};
