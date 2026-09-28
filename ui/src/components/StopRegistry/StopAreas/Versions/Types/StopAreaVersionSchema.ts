import { z } from 'zod';
import {
  reasonForChangeFormSchema,
  refineValidityPeriodSchema,
  validityPeriodFormSchema,
} from '../../../../common/Forms';

export const stopAreaVersionSchema = z
  .object({})
  .merge(reasonForChangeFormSchema)
  .merge(validityPeriodFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type StopAreaVersionFormState = z.infer<typeof stopAreaVersionSchema>;
