import { DateTime } from 'luxon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../layoutComponents';

type ObservationDateInputProps = {
  readonly value: DateTime;
  readonly onChange: (value: DateTime) => void;
  readonly className?: string;
  readonly containerClassName?: string;
  readonly inputClassName?: string;
  readonly testId: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
};

export const ObservationDateInput: FC<ObservationDateInputProps> = ({
  value,
  onChange,
  className = '',
  containerClassName = className,
  inputClassName = className,
  testId,
  required = false,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const dateInputId = 'observation-date-input';
  return (
    <Column className={containerClassName}>
      <label htmlFor={dateInputId}>{t('filters.observationDate')}</label>
      <input
        type="date"
        value={value.toISODate()}
        onChange={(e) => onChange(DateTime.fromISO(e.target.value))}
        id={dateInputId}
        className={inputClassName}
        data-testid={testId}
        required={required}
        disabled={disabled}
      />
    </Column>
  );
};
