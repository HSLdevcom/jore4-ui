import { z } from 'zod';
import { StopRegistryTransportModeType } from '../../../generated/graphql';
import {
  ValidityPeriodFormState,
  refineValidityPeriodSchema,
  requiredNumber,
  requiredString,
  validityPeriodFormSchema,
} from '../common';

export const stopAreaFormSchema = z
  .object({
    id: z.string().optional(), // Used internally to determine if editing
    nameLongFin: z.string().optional(),
    nameLongSwe: z.string().optional(),
    abbreviationFin: z.string().optional(),
    abbreviationSwe: z.string().optional(),
    abbreviationEng: z.string().optional(),
    nameLongEng: z.string().optional(),
    nameEng: z.string().max(21, 'nameValueTooLong').optional(),
    nameSwe: z.string().max(21, 'nameValueTooLong').optional(),
    privateCode: requiredString,
    name: requiredString.max(21, 'nameValueTooLong'),
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
    transportMode: z.nativeEnum(StopRegistryTransportModeType).optional(),
  })
  .merge(validityPeriodFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type StopAreaFormState = z.infer<typeof stopAreaFormSchema> &
  ValidityPeriodFormState;
