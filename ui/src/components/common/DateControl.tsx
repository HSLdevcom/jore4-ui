import { DateTime } from 'luxon';
import { FC } from 'react';
import { QueryParameterName } from '../../hooks';
import { useDateQueryParam } from '../../hooks/urlQuery/useDateQueryParam';
import { DateInput } from './DateInput';

type DateControlProps = {
  readonly label: string;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly testId: string;
  readonly dateInputId: string;
  readonly queryParamName: QueryParameterName;
  readonly initialize?: boolean;
};

/**
 * Date input which handles its own state in query params.
 * The query parameter name is required as parameter
 */
export const DateControl: FC<DateControlProps> = ({
  label,
  className,
  disabled = false,
  testId,
  dateInputId,
  queryParamName,
  initialize,
}) => {
  const { date, setDateToUrl } = useDateQueryParam({
    queryParamName,
    initialize,
  });
  const onDateChange = (newDate: DateTime) => {
    // Do not allow setting empty value to date
    if (!date.isValid) {
      return;
    }

    setDateToUrl(newDate);
  };

  return (
    <DateInput
      label={label}
      value={date}
      onChange={onDateChange}
      className={className}
      required
      disabled={disabled}
      testId={testId}
      dateInputId={dateInputId}
    />
  );
};
