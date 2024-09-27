import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { QueryParameterName } from '../../hooks';
import { useDateQueryParam } from '../../hooks/urlQuery/useDateQueryParam';
import { DateInput } from './DateInput';

interface Props {
  label: string;
  className?: string;
  disabled?: boolean;
  testId: string;
  dateInputId: string;
  queryParamName: QueryParameterName;
  initialize?: boolean;
}

/**
 * Date input which handles its own state in query params.
 * The query parameter name is required as parameter
 */
export const DateControl = ({
  label,
  className = '',
  disabled = false,
  testId,
  dateInputId,
  queryParamName,
  initialize,
}: Props): React.ReactElement => {
  const { date, setDateToUrl } = useDateQueryParam({
    queryParamName,
    initialize,
  });

  const [myNewDate, setMyNewDate] = useState<DateTime>(date);
  const [debouncedValue, setDebouncedValue] = useState<DateTime>(date);

  /* eslint-disable react-hooks/exhaustive-deps */
  // Workaround for useDateQueryParam hook side effects
  const doSet = useCallback(() => {
    setDateToUrl(debouncedValue);
  }, [debouncedValue]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(myNewDate);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [myNewDate]);

  useEffect(() => {
    doSet();
  }, [doSet, debouncedValue]);

  const onDateChange = (newDate: DateTime) => {
    // Do not allow setting empty value to date
    if (!date.isValid) {
      return;
    }
    setMyNewDate(newDate);
  };

  return (
    <DateInput
      label={label}
      value={myNewDate}
      onChange={onDateChange}
      className={className}
      required
      disabled={disabled}
      testId={testId}
      dateInputId={dateInputId}
    />
  );
};
