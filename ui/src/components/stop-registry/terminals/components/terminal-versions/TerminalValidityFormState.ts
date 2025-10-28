import { z } from 'zod';
import {
  refineValidityPeriodSchema,
  requiredString,
  validityPeriodFormSchema,
} from '../../../../forms/common';

export const terminalValidityFormSchema = z
  .object({
    versionName: requiredString,
    versionDescription: z.string().optional(), // Not implemented
  })
  .merge(validityPeriodFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type TerminalValidityFormState = z.infer<
  typeof terminalValidityFormSchema
>;
