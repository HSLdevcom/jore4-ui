import { FC, MouseEventHandler } from 'react';
import { Column } from '../LayoutComponents';
import { BaseDateInput } from './BaseDateInput';

type DateInputProps = {
  readonly value: Temporal.PlainDate;
  readonly label: string;
  readonly onChange: (value: Temporal.PlainDate) => void;
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
