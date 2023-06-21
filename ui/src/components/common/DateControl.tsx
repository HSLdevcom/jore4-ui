import { DateTime } from 'luxon';
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
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
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
  onClick,
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
      onClick={onClick}
      className={className}
      required
      disabled={disabled}
      testId={testId}
      dateInputId={dateInputId}
    />
  );
};
