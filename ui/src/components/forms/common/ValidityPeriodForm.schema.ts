import { z } from 'zod';
import { requiredString } from './customZodSchemas';

// Allow only dates between year 1000 and 2999
export const dateRegex = /^[12][0-9]{3}-[0-9]{2}-[0-9]{2}$/;

export const validityPeriodFormSchema = z.object({
  validityStart: requiredString.regex(dateRegex, 'invalidValidityStartDate'),
  validityEnd: z
    .string()
    .refine((val) => !val || dateRegex.test(val), 'invalidValidityEndDate')
    .optional(),
  indefinite: z.boolean(),
});

export type ValidityPeriodFormState = z.infer<typeof validityPeriodFormSchema>;

// Separate function for validating the validity end date.
// Run this inside a superRefine after all the schemas have been merged.
export function refineValidityPeriodSchema(
  data: { validityStart: string; validityEnd?: string; indefinite: boolean },
  ctx: z.RefinementCtx,
) {
  const { validityStart, validityEnd, indefinite } = data;

  if (indefinite) {
    return;
  }

  if (!validityEnd) {
    ctx.addIssue({
      path: ['validityEnd'],
      message: 'validityEndNotDefined',
      code: z.ZodIssueCode.custom,
    });
  } else if (!dateRegex.test(validityEnd)) {
    ctx.addIssue({
      path: ['validityEnd'],
      message: 'invalidValidityEndDate',
      code: z.ZodIssueCode.custom,
    });
  } else if (validityStart && dateRegex.test(validityStart)) {
    if (validityEnd < validityStart) {
      ctx.addIssue({
        path: ['validityEnd'],
        message: 'validityEndDateBeforeStartDate',
        code: z.ZodIssueCode.custom,
      });
    }
  }
}
