import { z } from 'zod';

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
