import { DateTime } from 'luxon';
import { QueryParameterName, useDateQueryParam } from '../../hooks';
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
}: Props): JSX.Element => {
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
