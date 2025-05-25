import { DateTime } from 'luxon';
import { FC } from 'react';
import { Column } from '../../layoutComponents';

type DateInputProps = {
  readonly value: DateTime;
  readonly label: string;
  readonly onChange: (value: DateTime) => void;
  readonly className?: string;
  readonly testId: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly dateInputId: string;
  readonly onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
};

export const DateInput: FC<DateInputProps> = ({
  value,
  label,
  onChange,
  className = '',
  testId,
  required = false,
  disabled = false,
  dateInputId,
  onClick,
}) => {
  return (
    <Column className={className}>
      <label htmlFor={dateInputId}>{label}</label>
      <input
        type="date"
        value={value.toISODate()}
        onChange={(e) => onChange(DateTime.fromISO(e.target.value))}
        onClick={onClick}
        id={dateInputId}
        className={className}
        data-testid={testId}
        required={required}
        disabled={disabled}
      />
    </Column>
  );
};
