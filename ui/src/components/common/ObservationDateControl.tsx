import { DateTime } from 'luxon';
import { FC } from 'react';
import { useObservationDateQueryParam } from '../../hooks';
import { ObservationDateInput } from '../forms/common';

const testIds = {
  observationDateInput: 'ObservationDateControl::dateInput',
};

type ObservationDateControlProps = {
  readonly className?: string;
  readonly containerClassName?: string;
  readonly inputClassName?: string;
  readonly disabled?: boolean;
};

/**
 * Observation date input which handles its own state in query params.
 */
export const ObservationDateControl: FC<ObservationDateControlProps> = ({
  className,
  containerClassName,
  inputClassName,
  disabled = false,
}) => {
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
      containerClassName={containerClassName}
      inputClassName={inputClassName}
      required
      disabled={disabled}
      testId={testIds.observationDateInput}
    />
  );
};
