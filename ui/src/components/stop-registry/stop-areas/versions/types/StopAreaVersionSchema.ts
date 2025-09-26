import { z } from 'zod';
import {
  requiredString,
  validityPeriodFormSchema,
} from '../../../../forms/common';

export const stopAreaVersionSchema = z
  .object({
    versionName: requiredString,
    versionDescription: z.string().optional(), // Not implemented
  })
  .merge(validityPeriodFormSchema);

export type StopAreaVersionFormState = z.infer<typeof stopAreaVersionSchema>;
