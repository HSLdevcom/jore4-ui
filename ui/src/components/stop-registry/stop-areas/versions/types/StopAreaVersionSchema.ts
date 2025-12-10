import { z } from 'zod';
import {
  reasonForChangeFormSchema,
  refineValidityPeriodSchema,
  validityPeriodFormSchema,
} from '../../../../forms/common';

export const stopAreaVersionSchema = z
  .object({})
  .merge(reasonForChangeFormSchema)
  .merge(validityPeriodFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type StopAreaVersionFormState = z.infer<typeof stopAreaVersionSchema>;
