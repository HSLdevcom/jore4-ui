import { DateTime } from 'luxon';
import { FC, KeyboardEventHandler, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseDateInput } from '../../common/BaseDateInput';
import { Column } from '../../common/LayoutComponents';

type ObservationDateInputProps = {
  readonly id?: string;
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
  id = 'observation-date-input',
  value,
  onChange,
  // TODO: Check and fix this class bs
  className,
  containerClassName = className,
  inputClassName = className,
  testId,
  required = false,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const [localValue, setLocalValue] = useState(value);
  useEffect(() => setLocalValue(value), [value]);

  const submitChangedValue = () => {
    if (!value.equals(localValue)) {
      onChange(localValue);
    }
  };

  const submitOnEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      submitChangedValue();
    }
  };

  return (
    <Column className={containerClassName}>
      <label htmlFor={id}>{t(($) => $.filters.observationDate)}</label>
      <BaseDateInput
        parsed
        value={value}
        onBlur={submitChangedValue}
        onChange={onChange}
        onKeyUp={submitOnEnter}
        id={id}
        className={inputClassName}
        data-testid={testId}
        required={required}
        disabled={disabled}
      />
    </Column>
  );
};
