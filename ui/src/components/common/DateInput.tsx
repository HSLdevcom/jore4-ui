import { DateTime } from 'luxon';
import { Column } from '../../layoutComponents';

interface Props {
  value: DateTime;
  label: string;
  onChange: (value: DateTime) => void;
  className?: string;
  testId: string;
  required?: boolean;
  disabled?: boolean;
  dateInputId: string;
}

export const DateInput = ({
  value,
  label,
  onChange,
  className = '',
  testId,
  required = false,
  disabled = false,
  dateInputId,
}: Props): JSX.Element => {
  return (
    <Column className={className}>
      <label htmlFor={dateInputId}>{label}</label>
      <input
        type="date"
        value={value.toISODate()}
        onChange={(e) => onChange(DateTime.fromISO(e.target.value))}
        id={dateInputId}
        className={className}
        data-testid={testId}
        required={required}
        disabled={disabled}
      />
    </Column>
  );
};
