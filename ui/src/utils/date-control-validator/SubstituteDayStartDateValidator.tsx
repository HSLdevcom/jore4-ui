import { SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS } from '@/components/timetables/substitute-day-settings/common_substitute_day_defaults';
import {
  DateControlValidatorType,
  DateValidatorData,
  DateValidatorProps,
} from '@/utils/date-control-validator/date_control_validator_common';

export const SubstituteDayStartDateValidator = (): DateControlValidatorType => {
  const validate = (props: DateValidatorProps): DateValidatorData => {
    if (!props) {
      throw Error('Empty properties to SubstituteDayStartDateValidator');
    }
    const { startDate, endDate, newValue } = props;
    const timeDiff = endDate.diff(newValue ?? startDate);

    if (timeDiff.as('year') > SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS) {
      const newStartDate = endDate.minus({
        year: SUBSTITUTE_PERIODS_OBSERVATION_PERIOD_MAX_YEARS,
      });

      return {
        valid: false,
        originalDate: startDate,
        replacedDate: newStartDate,
      };
    }

    return { valid: true, originalDate: startDate, replacedDate: startDate };
  };

  return { validate };
};
