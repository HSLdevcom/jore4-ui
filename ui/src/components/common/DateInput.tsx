import { DateTime } from 'luxon';
import { FC, MouseEventHandler } from 'react';
import { BaseDateInput } from './BaseDateInput';
import { Column } from './LayoutComponents';

type DateInputProps = {
  readonly value: DateTime;
  readonly label: string;
  readonly onChange: (value: DateTime) => void;
  readonly className?: string;
  readonly testId: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly dateInputId: string;
  readonly onClick?: MouseEventHandler<HTMLInputElement>;
};

export const DateInput: FC<DateInputProps> = ({
  value,
  label,
  onChange,
  className,
  testId,
  required = false,
  disabled = false,
  dateInputId,
  onClick,
}) => {
  return (
    <Column className={className}>
      <label htmlFor={dateInputId}>{label}</label>
      <BaseDateInput
        parsed
        value={value}
        onChange={onChange}
        onClick={onClick}
        id={dateInputId}
        data-testid={testId}
        required={required}
        disabled={disabled}
      />
    </Column>
  );
};
