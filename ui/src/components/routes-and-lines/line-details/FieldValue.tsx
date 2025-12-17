import { FC } from 'react';
import { Column } from '../../../layoutComponents';

type FieldValueProps = {
  readonly className?: string;
  readonly fieldName: string;
  readonly value?: string;
  readonly testId?: string;
};

export const FieldValue: FC<FieldValueProps> = ({
  className,
  fieldName,
  value,
  testId,
}) => {
  return (
    <Column className={className}>
      <span className="text-sm">{fieldName}</span>
      <span className="text-m font-bold" data-testid={testId}>
        {value ?? '-'}
      </span>
    </Column>
  );
};
