import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '../../../layoutComponents';

interface Props {
  value: DateTime;
  onChange: (value: DateTime) => void;
  className?: string;
}

export const ObservationDateInput = ({
  value,
  onChange,
  className = '',
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const dateInputId = 'observation-date-input';
  return (
    <Row className={className}>
      <Column>
        <label htmlFor={dateInputId}>{t('filters.observationDate')}</label>
        <input
          type="date"
          value={value.toISODate()}
          onChange={(e) => onChange(DateTime.fromISO(e.target.value))}
          id={dateInputId}
        />
      </Column>
    </Row>
  );
};
