import { z } from 'zod';
import {
  ValidityPeriodFormState,
  requiredString,
} from '../../../../../forms/common';

export const terminalFormSchema = z.object({
  description: z.object({
    lang: z.string().nullable(),
    value: z.string().nullable(),
  }),
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
  terminalType: z.string().optional(),
  departurePlatforms: z.string().optional(),
  arrivalPlatforms: z.string().optional(),
  loadingPlatforms: z.string().optional(),
  electricCharging: z.string().optional(),
});

export type TerminalFormState = z.infer<typeof terminalFormSchema> &
  ValidityPeriodFormState;
