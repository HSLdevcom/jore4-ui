import { z } from 'zod';

const optionalString = z.string().nullable();

export const stopModalStopAreaFormSchema = z.object({
  netextId: z.string(),
  privateCode: z.string(),

  validityStart: z.string(),
  validityEnd: optionalString,

  nameFin: optionalString,
  nameSwe: optionalString,
  nameEng: optionalString,

  longNameFin: optionalString,
  longNameSwe: optionalString,
  longNameEng: optionalString,

  abbreviationFin: optionalString,
  abbreviationSwe: optionalString,
  abbreviationEng: optionalString,
});

export type StopModalStopAreaFormSchema = z.infer<
  typeof stopModalStopAreaFormSchema
>;
