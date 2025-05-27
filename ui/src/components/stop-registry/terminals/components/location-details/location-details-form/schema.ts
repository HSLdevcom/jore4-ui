import { z } from 'zod';

export const terminalLocationDetailsFormSchema = z.object({
  streetAddress: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  municipality: z.string().optional().nullable(),
  fareZone: z.string().optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
});

export type TerminalLocationDetailsFormState = z.infer<
  typeof terminalLocationDetailsFormSchema
>;
