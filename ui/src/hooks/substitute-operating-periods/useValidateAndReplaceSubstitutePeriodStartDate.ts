import { useEffect, useState } from 'react';
import { QueryParameterName, useDateQueryParam } from '@/hooks/urlQuery';
import { DateValidatorSource } from '@/utils/date-control-validator';
import { useDateControlValidator } from '@/utils/date-control-validator/useDateControlValidator';

export const useValidateAndReplaceSubstitutePeriodStartDate = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { date: startDate, setDateToUrl } = useDateQueryParam({
    queryParamName: QueryParameterName.StartDate,
    initialize: false,
  });
  const { date: endDate } = useDateQueryParam({
    queryParamName: QueryParameterName.EndDate,
    initialize: false,
  });
  const { validator } = useDateControlValidator(
    DateValidatorSource.SubstitutePeriodStartDay,
    [QueryParameterName.StartDate, QueryParameterName.EndDate],
  );

  useEffect(() => {
    if (startDate && endDate) {
      if (validator) {
        setIsLoading(true);

        const { replacedDate, valid } = validator.validate({
          startDate,
          endDate,
        });
        if (!valid) {
          setDateToUrl(replacedDate ?? startDate);
        } else {
          setDateToUrl(startDate);
        }
      }
    }
    setIsLoading(false);
  }, [endDate, setDateToUrl, startDate, validator]);

  return { isLoading };
};
