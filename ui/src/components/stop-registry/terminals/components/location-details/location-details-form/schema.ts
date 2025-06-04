import { z } from 'zod';
import { validityPeriodFormSchema } from '../../../../../forms/common';

export const selectedStopSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    quayId: z.string(),
    publicCode: z.string(),
  })
  .merge(validityPeriodFormSchema);

export const terminalLocationDetailsFormSchema = z.object({
  streetAddress: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  municipality: z.string().optional().nullable(),
  fareZone: z.string().optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  selectedStops: z.array(selectedStopSchema).default([]),
});

export type TerminalLocationDetailsFormState = z.infer<
  typeof terminalLocationDetailsFormSchema
>;

export type SelectedStop = z.infer<typeof selectedStopSchema>;
