import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../layoutComponents';

interface Props {
  value: DateTime;
  onChange: (value: DateTime) => void;
  className?: string;
  testId: string;
  required?: boolean;
  disabled?: boolean;
}

export const ObservationDateInput = ({
  value,
  onChange,
  className = '',
  testId,
  required = false,
  disabled = false,
}: Props): React.ReactElement => {
  const { t } = useTranslation();
  const dateInputId = 'observation-date-input';
  return (
    <Column className={className}>
      <label htmlFor={dateInputId}>{t('filters.observationDate')}</label>
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
