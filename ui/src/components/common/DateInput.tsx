import { DateTime } from 'luxon';
import { FC, MouseEventHandler } from 'react';
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
  readonly onClick?: MouseEventHandler<HTMLInputElement>;
};

export const DateInput: FC<DateInputProps> = ({
  value,
  label,
  onChange,
  // TODO: This prop is improperly used as input for multiple nested components (<Column> & <Input>). I do not know which one should actually get the the prop, as I am unable to open the use place due to lack of test data for Timetables. Thus cannot fix this.
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
