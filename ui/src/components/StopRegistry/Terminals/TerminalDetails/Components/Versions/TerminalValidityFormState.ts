import { z } from 'zod';
import {
  reasonForChangeFormSchema,
  refineValidityPeriodSchema,
  validityPeriodFormSchema,
} from '../../../../../common/Forms';

export const terminalValidityFormSchema = z
  .object({})
  .merge(reasonForChangeFormSchema)
  .merge(validityPeriodFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type TerminalValidityFormState = z.infer<
  typeof terminalValidityFormSchema
>;
