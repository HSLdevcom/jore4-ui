import { z } from 'zod';
import {
  ValidityPeriodFormState,
  refineValidityPeriodSchema,
  requiredNumber,
  requiredString,
  validityPeriodFormSchema,
} from '../../../../../forms/common';
import { selectedStopSchema } from '../../../../components/SelectMemberStops/common/schema';
import { TerminalType } from '../../../../types/TerminalType';

export const terminalFormSchema = z
  .object({
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
    nameSwe: z.string().optional(),
    privateCode: requiredString,
    name: requiredString,
    terminalType: z.nativeEnum(TerminalType).optional(),
    departurePlatforms: z.string().optional(),
    arrivalPlatforms: z.string().optional(),
    loadingPlatforms: z.string().optional(),
    electricCharging: z.string().optional(),
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
    selectedStops: z.array(selectedStopSchema).min(1),
  })
  .merge(validityPeriodFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type TerminalFormState = z.infer<typeof terminalFormSchema> &
  ValidityPeriodFormState;
