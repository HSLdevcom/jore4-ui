import { z } from 'zod';
import { StopRegistryTransportModeType } from '../../../../../../generated/graphql';
import { StopPlaceState } from '../../../../../../types/stop-registry';
import { requiredString } from '../../../../../forms/common';

export const schema = z.object({
  privateCode: requiredString,
  nameFin: requiredString,
  nameSwe: requiredString,
  label: requiredString,
  locationFin: z.string().optional(),
  locationSwe: z.string().optional(),
  nameLongFin: z.string().optional(),
  nameLongSwe: z.string().optional(),
  abbreviationFin: z.string().optional(),
  abbreviationSwe: z.string().optional(),
  stopTypes: z.object({
    virtual: z.boolean(),
    railReplacement: z.boolean(),
  }),
  transportMode: z
    .nativeEnum(StopRegistryTransportModeType)
    .optional()
    .nullable(),
  elyNumber: z.string(),
  timingPlaceId: z.string().uuid().nullable(),
  stopState: z.nativeEnum(StopPlaceState),
});

export type StopBasicDetailsFormState = z.infer<typeof schema>;
