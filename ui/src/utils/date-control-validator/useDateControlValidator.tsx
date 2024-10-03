import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useUrlQuery } from '@/hooks/urlQuery';
import {
  DateControlValidator,
  DateControlValidatorType,
  DateValidatorSource,
} from '@/utils/date-control-validator/index';

export const useDateControlValidator = (
  source: DateValidatorSource,
  dateParamNames: string[],
) => {
  const { getDateTimeFromUrlQuery } = useUrlQuery();
  const [validator, setValidator] = useState<DateControlValidatorType>();
  const [dateParamValues, setDateParamValues] = useState(
    new Map<string, DateTime | undefined>(),
  );

  useEffect(() => {
    const newParamValues = dateParamValues;
    dateParamNames.forEach((dt) => {
      newParamValues.set(dt, getDateTimeFromUrlQuery(dt));
    });

    setDateParamValues(newParamValues);
  }, [dateParamNames, dateParamValues, getDateTimeFromUrlQuery]);

  useEffect(() => {
    setValidator(DateControlValidator.validatorFor(source));
  }, [source]);

  return {
    validator,
    dateParamValues,
  };
};
