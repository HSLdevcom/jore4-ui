import { DateTime } from 'luxon';
import { FC, KeyboardEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../layoutComponents';
import { mapToISODate, parseDate } from '../../../time';

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

  const [localDateValue, setLocalDateValue] = useState(
    () => mapToISODate(value) ?? '',
  );

  const updateUrlState = useCallback(() => {
    const newDate = parseDate(localDateValue);

    if (!newDate.isValid) {
      setLocalDateValue(mapToISODate(value) ?? '');
      return;
    }

    if (!newDate.equals(value)) {
      onChange(newDate);
    }
  }, [localDateValue, value, onChange]);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        updateUrlState();
      }
    },
    [updateUrlState],
  );

  return (
    <Column className={containerClassName}>
      <label htmlFor={dateInputId}>{t('filters.observationDate')}</label>
      <input
        type="date"
        value={localDateValue}
        onChange={(e) => setLocalDateValue(e.target.value)}
        onBlur={updateUrlState}
        onKeyUp={handleKeyUp}
        id={dateInputId}
        className={inputClassName}
        data-testid={testId}
        required={required}
        disabled={disabled}
      />
    </Column>
  );
};
