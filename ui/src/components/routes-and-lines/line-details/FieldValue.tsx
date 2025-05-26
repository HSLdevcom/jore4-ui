import { FC } from 'react';
import { Column } from '../../../layoutComponents';

type FieldValueProps = {
  readonly className?: string;
  readonly fieldName: string;
  readonly value?: string;
  readonly testId?: string;
};

export const FieldValue: FC<FieldValueProps> = ({
  className = '',
  fieldName,
  value,
  testId,
}) => {
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
