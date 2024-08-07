import { z } from 'zod';
import { requiredNumber } from '../../../../forms/common';

export const locationDetailsFormSchema = z.object({
  streetAddress: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  municipality: z.string().optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number(),
  // We don't currently have a mechanism to remove values from keyValues, where this will end up.
  // Could add, but didn't deem it necessary yet. Easier to just make this required.
  functionalArea: requiredNumber,
});

export type LocationDetailsFormState = z.infer<
  typeof locationDetailsFormSchema
>;
