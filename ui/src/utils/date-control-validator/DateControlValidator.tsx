import { DateValidatorSource } from '@/utils/date-control-validator/date_control_validator_common';
import { NoOpDateValidator } from '@/utils/date-control-validator/NoOpDateValidator';
import { SubstituteDayStartDateValidator } from '@/utils/date-control-validator/SubstituteDayStartDateValidator';

export const DateControlValidator = (): void => {
  // This is intentionally left blank
};
DateControlValidator.validatorFor = (source: DateValidatorSource | null) => {
  if (source === DateValidatorSource.SubstitutePeriodStartDay) {
    return SubstituteDayStartDateValidator();
  }
  return NoOpDateValidator();
};
