import { z } from 'zod';
import { selectedStopSchema } from '../../../../../Components/SelectMemberStops/common';

export const terminalLocationDetailsFormSchema = z.object({
  streetAddress: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  selectedStops: z.array(selectedStopSchema).default([]),
});

export type TerminalLocationDetailsFormState = z.infer<
  typeof terminalLocationDetailsFormSchema
>;
