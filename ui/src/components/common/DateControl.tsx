import { DateTime } from 'luxon';
import { useCallback, useState } from 'react';
import { QueryParameterName, useDateQueryParam } from '@/hooks/urlQuery';
import {
  DateControlValidatorType,
  DateValidatorProps,
} from '@/utils/date-control-validator';
import { DateInput } from './DateInput';

interface Props {
  label: string;
  className?: string;
  disabled?: boolean;
  testId: string;
  dateInputId: string;
  queryParamName: QueryParameterName;
  initialize?: boolean;
  handleChange: (newDate: DateTime) => void;
  validator?: DateControlValidatorType;
  validatorProps?: DateValidatorProps;
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
  handleChange,
  validator,
  validatorProps,
}: Props): React.ReactElement => {
  const { date } = useDateQueryParam({
    queryParamName,
    initialize,
  });

  const [myNewDate, setMyNewDate] = useState<DateTime>(date);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const doSet = useCallback((newDate: DateTime) => {
    if (newDate) {
      setMyNewDate(newDate);
      handleChange(newDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeDate = (newDate: DateTime) => {
    if (date.isValid) {
      setMyNewDate(newDate);
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const handler = setTimeout(() => {
      if (validator && validatorProps) {
        const { valid, replacedDate } = validator.validate({
          ...validatorProps,
          newValue: newDate,
        });
        if (!valid && replacedDate) {
          doSet(replacedDate);
        } else {
          doSet(newDate);
        }
      } else {
        doSet(newDate);
      }
    }, 2000);

    setTimeoutId(handler);
  };

  const onDateChange = (newDate: DateTime) => {
    handleChangeDate(newDate);
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
