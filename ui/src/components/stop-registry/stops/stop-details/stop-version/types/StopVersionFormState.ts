import { z } from 'zod';
import {
  priorityFormSchema,
  refineValidityPeriodSchema,
  requiredString,
  validityPeriodFormSchema,
} from '../../../../../forms/common';

export const stopVersionSchema = z
  .object({
    versionName: requiredString,
    versionDescription: z.string().optional(), // Not implemented
  })
  .merge(validityPeriodFormSchema)
  .merge(z.object({ validityRangeIsValidVirtualField: z.void() }))
  .merge(priorityFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type StopVersionFormState = z.infer<typeof stopVersionSchema>;
