import { z } from 'zod';

const optionalString = z.string().nullable();

export const stopModalStopAreaFormSchema = z.object({
  netextId: z.string(),
  privateCode: z.string(),

  validityStart: z.string(),
  validityEnd: optionalString,

  nameFin: optionalString,
  nameSwe: optionalString,

  longNameFin: optionalString,
  longNameSwe: optionalString,

  abbreviationFin: optionalString,
  abbreviationSwe: optionalString,
});

export type StopModalStopAreaFormSchema = z.infer<
  typeof stopModalStopAreaFormSchema
>;
