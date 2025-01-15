import { z } from 'zod';
import {
  priorityFormSchema,
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
  .merge(priorityFormSchema);

export type StopVersionFormState = z.infer<typeof stopVersionSchema>;
