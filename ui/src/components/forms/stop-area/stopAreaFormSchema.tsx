import { z } from 'zod';
import {
  ValidityPeriodFormState,
  requiredNumber,
  requiredString,
  validityPeriodFormSchema,
} from '../common';

export const stopAreaFormSchema = z
  .object({
    nameLongFin: z.string().optional(),
    nameLongSwe: z.string().optional(),
    abbreviationFin: z.string().optional(),
    abbreviationSwe: z.string().optional(),
    abbreviationEng: z.string().optional(),
    nameLongEng: z.string().optional(),
    nameEng: z.string().optional(),
    nameSwe: requiredString,
    privateCode: requiredString,
    name: requiredString,
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
  })
  .merge(validityPeriodFormSchema);

export type StopAreaFormState = z.infer<typeof stopAreaFormSchema> &
  ValidityPeriodFormState;
