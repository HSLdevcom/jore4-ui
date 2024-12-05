import { DateTime } from 'luxon';
import { z } from 'zod';
import { NullOptionEnum } from '../../../utils/enum';

export const REQUIRED_FIELD_ERROR_MESSAGE = 'Required';

export const requiredString = z.string().min(1, REQUIRED_FIELD_ERROR_MESSAGE);

/**
 * Whenever number field has NaN value, we will show
 * "field required" error.
 * This is because form field with 'valueAsNumber' flag
 * automatically converts value to number resulting empty
 * field having value NaN. The flag is required for zod to
 * accept the value as a number.
 */
export const requiredNumber = z.number({
  invalid_type_error: REQUIRED_FIELD_ERROR_MESSAGE,
});

export const requiredUuid = requiredString.uuid();

export const localizedStringRequired = z.object({
  fi_FI: requiredString,
  sv_FI: requiredString,
});

export const localizedStringOptional = z.object({
  fi_FI: z.string().optional(),
  sv_FI: z.string().optional(),
});

// Workaround for numbers
// For some reason input value is NaN,
// if value is not a number or is empty.
// This probably has to do something with valueAsNumber-flag,
// which is required so that our number input values are number type
// instead of string.
// Therefore we cannot use z.number, because it would always fail with
// "Expected number, received nan"
// As a workaround just map all values that are not numbers to null
export const nullableNumber = z.any().transform((value): number | null => {
  return Number.isNaN(value) ? null : value;
});

// A helper to create zod enums for fields that accept booleans + null.
// Intended to be used with `NullableBooleanDropdown`.
export const nullableBoolean = z.any().transform((value): boolean | null => {
  if (value === true || value === 'true') {
    return true;
  }
  if (value === false || value === 'false') {
    return false;
  }
  return null;
});

// A helper to create zod fields that accept an enum + a null value.
export const createNullableEnum = <T>() => {
  return z.any().transform((value): T | NullOptionEnum | null => {
    if (!value || value === NullOptionEnum.Null) {
      return null;
    }
    return value as T;
  });
};

export const requiredDate = requiredString.regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
export const optionaldDate = requiredString.regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/).optional();

/**
 *  Regex for validating time/interval-field
 * 04:30 - 28:30
 * */
export const requiredInterval = requiredString.regex(
  /^([0-9]|0[4-9]|1[0-9]|2[0-8]):[0-5][0-9]$/,
  'invalidTime',
);

export const nullablePositiveNumber = z
  .any()
  .transform((value, ctx): number | null => {
    if (Number.isInteger(value)) {
      if (value < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 0,
          inclusive: true,
          type: 'number',
        });
      }
    }
    return Number.isNaN(value) ? null : value;
  });

export const instanceOfDateTime = z.custom<DateTime>(DateTime.isDateTime);

export function getStringEnumValues<T extends Record<string, string>>(enumObj: T): readonly [string, ...string[] ]{
  const values = Object.values(enumObj)
  return [values[0], ...values.slice(1)];
}
