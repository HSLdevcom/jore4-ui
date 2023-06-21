import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { showWarningToast } from '../../utils/toastService';
import { useDateQueryParam } from './useDateQueryParam';
import { QueryParameterName, useUrlQuery } from './useUrlQuery';

export const useTimeRangeQueryParams = () => {
  const { t } = useTranslation();
  const { setMultipleParametersToUrlQuery } = useUrlQuery();
  const { date: startDate, setDateToUrl: setStartDateToUrl } =
    useDateQueryParam({
      queryParamName: QueryParameterName.StartDate,
    });
  const { date: endDate, setDateToUrl: setEndDateToUrl } = useDateQueryParam({
    queryParamName: QueryParameterName.EndDate,
  });

  const isInvalidDateRange = startDate > endDate;

  const updateTimeRangeIfNeeded = (
    newStartDate: DateTime,
    newEndDate: DateTime,
  ) => {
    if (newStartDate < startDate && newEndDate > endDate) {
      setMultipleParametersToUrlQuery({
        parameters: [
          {
            paramName: QueryParameterName.EndDate,
            value: newEndDate,
          },
          {
            paramName: QueryParameterName.StartDate,
            value: newStartDate,
          },
        ],
      });
      showWarningToast(
        t('timetables.observationPeriodForm.observationPeriodAdjusted'),
      );
    } else if (newStartDate < startDate) {
      setStartDateToUrl(newStartDate);
      showWarningToast(
        t('timetables.observationPeriodForm.observationPeriodAdjusted'),
      );
    } else if (newEndDate > endDate) {
      setEndDateToUrl(newEndDate);
      showWarningToast(
        t('timetables.observationPeriodForm.observationPeriodAdjusted'),
      );
    }
  };

  return { startDate, endDate, isInvalidDateRange, updateTimeRangeIfNeeded };
};
