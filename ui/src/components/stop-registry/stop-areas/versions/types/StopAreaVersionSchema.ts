import { z } from 'zod';
import {
  refineValidityPeriodSchema,
  requiredString,
  validityPeriodFormSchema,
} from '../../../../forms/common';

export const stopAreaVersionSchema = z
  .object({
    versionName: requiredString,
    versionDescription: z.string().optional(), // Not implemented
  })
  .merge(validityPeriodFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type StopAreaVersionFormState = z.infer<typeof stopAreaVersionSchema>;
