import { DateTime } from 'luxon';
import { useObservationDateQueryParam } from '../../hooks';
import { ObservationDateInput } from '../forms/common';

interface Props {
  className?: string;
  disabled?: boolean;
}

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
    />
  );
};
