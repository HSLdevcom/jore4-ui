import {
  DateControlValidatorType,
  DateValidatorData,
} from '@/utils/date-control-validator/date_control_validator_common';

export const NoOpDateValidator = (): DateControlValidatorType => {
  const validate = (): DateValidatorData => {
    return { valid: false, originalDate: null, replacedDate: null };
  };

  return { validate };
};
