import { useDateQueryParam } from './useDateQueryParam';
import { QueryParameterName } from './useUrlQuery';

export const useTimeRangeQueryParams = () => {
  const { date: startDate } = useDateQueryParam({
    queryParamName: QueryParameterName.StartDate,
  });
  const { date: endDate } = useDateQueryParam({
    queryParamName: QueryParameterName.EndDate,
  });
  const isInvalidDateRange = startDate > endDate;
  return { startDate, endDate, isInvalidDateRange };
};
