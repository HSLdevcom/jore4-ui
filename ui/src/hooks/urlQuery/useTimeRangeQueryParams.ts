import { useTranslation } from 'react-i18next';
import { today } from '../../utils/time';
import { showWarningToast } from '../../utils/toastService';
import { useDateQueryParam } from './useDateQueryParam';
import { QueryParameterName, useUrlQuery } from './useUrlQuery';

export function useTimeRangeQueryParams() {
  const { t } = useTranslation();
  const { setMultipleParametersToUrlQuery } = useUrlQuery();
  const { date: startDate, setDateToUrl: setStartDateToUrl } =
    useDateQueryParam({
      queryParamName: QueryParameterName.StartDate,
    });
  const { date: endDate, setDateToUrl: setEndDateToUrl } = useDateQueryParam({
    queryParamName: QueryParameterName.EndDate,
    initialDate: today().add({ years: 1 }),
  });

  const isInvalidDateRange = Temporal.PlainDate.compare(startDate, endDate) > 0;

  const updateTimeRangeIfNeeded = (
    newStartDate: Temporal.PlainDate,
    newEndDate: Temporal.PlainDate,
  ) => {
    const startsEarlier =
      Temporal.PlainDate.compare(newStartDate, startDate) < 0;
    const endsLater = Temporal.PlainDate.compare(newEndDate, endDate) > 0;

    if (startsEarlier && endsLater) {
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
        t(($) => $.timetables.observationPeriodForm.observationPeriodAdjusted),
      );
    } else if (startsEarlier) {
      setStartDateToUrl(newStartDate);
      showWarningToast(
        t(($) => $.timetables.observationPeriodForm.observationPeriodAdjusted),
      );
    } else if (endsLater) {
      setEndDateToUrl(newEndDate);
      showWarningToast(
        t(($) => $.timetables.observationPeriodForm.observationPeriodAdjusted),
      );
    }
  };

  return { startDate, endDate, isInvalidDateRange, updateTimeRangeIfNeeded };
}
