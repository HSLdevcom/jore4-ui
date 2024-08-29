import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../layoutComponents';

interface Props {
  value: DateTime;
  onChange: (value: DateTime) => void;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
  testId: string;
  required?: boolean;
  disabled?: boolean;
}

export const ObservationDateInput = ({
  value,
  onChange,
  className = '',
  containerClassName = className,
  inputClassName = className,
  testId,
  required = false,
  disabled = false,
}: Props): React.ReactElement => {
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
