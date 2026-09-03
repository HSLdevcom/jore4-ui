import { z } from 'zod';
import {
  reasonForChangeFormSchema,
  refineValidityPeriodSchema,
  validityPeriodFormSchema,
} from '../../../../forms/common';

export const terminalValidityFormSchema = z
  .object({})
  .merge(reasonForChangeFormSchema)
  .merge(validityPeriodFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type TerminalValidityFormState = z.infer<
  typeof terminalValidityFormSchema
>;
