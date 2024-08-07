import { DateTime } from 'luxon';
import { useObservationDateQueryParam } from '../../hooks';
import { ObservationDateInput } from '../forms/common';

const testIds = {
  observationDateInput: 'ObservationDateControl::dateInput',
};

interface Props {
  className?: string;
  disabled?: boolean;
}

/**
 * Observation date input which handles its own state in query params.
 */
export const ObservationDateControl = ({
  className = '',
  disabled = false,
}: Props): JSX.Element => {
  const { observationDate, setObservationDateToUrl } =
    useObservationDateQueryParam();
  const onDateChange = (date: DateTime) => {
    // Do not allow setting empty value to observation date
    if (!date.isValid) {
      return;
    }

    setObservationDateToUrl(date);
  };

  return (
    <ObservationDateInput
      value={observationDate}
      onChange={onDateChange}
      className={className}
      required
      disabled={disabled}
      testId={testIds.observationDateInput}
    />
  );
};
