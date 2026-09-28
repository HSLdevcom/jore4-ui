import { z } from 'zod';
import {
  priorityFormSchema,
  reasonForChangeFormSchema,
  refineValidityPeriodSchema,
  validityPeriodFormSchema,
} from '../../../../../common/Forms';

export const stopVersionSchema = z
  .object({})
  .merge(reasonForChangeFormSchema)
  .merge(validityPeriodFormSchema)
  .merge(z.object({ validityRangeIsValidVirtualField: z.void() }))
  .merge(priorityFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type StopVersionFormState = z.infer<typeof stopVersionSchema>;
