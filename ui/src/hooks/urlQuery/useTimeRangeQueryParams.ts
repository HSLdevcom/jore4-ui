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

  const showToastIfNeeded = (showToast: boolean) => {
    if (showToast) {
      showWarningToast(
        t('timetables.observationPeriodForm.observationPeriodAdjusted'),
      );
    }
  };
  const updateTimeRangeIfNeeded = (
    start: DateTime,
    end: DateTime,
    showToast = true,
  ) => {
    if (start < startDate && end > endDate) {
      setMultipleParametersToUrlQuery({
        parameters: [
          {
            paramName: QueryParameterName.EndDate,
            value: end,
          },
          {
            paramName: QueryParameterName.StartDate,
            value: start,
          },
        ],
      });
      showToastIfNeeded(showToast);
    } else if (start < startDate) {
      setStartDateToUrl(start);
      showToastIfNeeded(showToast);
    } else if (end > endDate) {
      setEndDateToUrl(end);
      showToastIfNeeded(showToast);
    }
  };

  return { startDate, endDate, isInvalidDateRange, updateTimeRangeIfNeeded };
};
