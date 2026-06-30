import { FC } from 'react';
import { useDateQueryParam } from '../../hooks/urlQuery/useDateQueryParam';
import { QueryParameterName } from '../../hooks/urlQuery/useUrlQuery';
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

  return (
    <DateInput
      label={label}
      value={date}
      onChange={setDateToUrl}
      className={className}
      required
      disabled={disabled}
      testId={testId}
      dateInputId={dateInputId}
    />
  );
};
