import { DateTime } from 'luxon';
import { useCallback, useEffect, useState } from 'react';
import { QueryParameterName, useDateQueryParam } from '@/hooks/urlQuery';
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

  // Workaround for useDateQueryParam hook side effects
  const doSet = useCallback(() => {
    if (setDateToUrl) {
      setDateToUrl(debouncedValue);
    }
  }, [debouncedValue, setDateToUrl]);

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

  useEffect(() => {
    setMyNewDate(date);
  }, [date]);

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
