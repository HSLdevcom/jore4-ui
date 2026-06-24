import { DateTime } from 'luxon';
import { z } from 'zod';
import { StopRegistryTransportModeType } from '../../../../../../generated/graphql';
import { StopPlaceState } from '../../../../../../types/stop-registry';
import {
  reasonForChangeFormSchema,
  requiredString,
} from '../../../../../forms/common';

const stopStateValiditySchema = z.object({
  stopStateValidityStart: z.custom<DateTime>(),
  stopStateValidityEnd: z.custom<DateTime>(),
});

export const schema = z
  .object({
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
      trunkLineStop: z.boolean(),
      speedTramStop: z.boolean(),
    }),
    transportMode: z
      .nativeEnum(StopRegistryTransportModeType)
      .optional()
      .nullable(),
    elyNumber: z.string(),
    timingPlaceId: z.string().uuid().nullable(),
    stopState: z.nativeEnum(StopPlaceState),
  })
  .merge(stopStateValiditySchema)
  .merge(reasonForChangeFormSchema)
  .refine(
    (data) => {
      if (data.stopState === StopPlaceState.InOperation) {
        return true;
      }
      return data.stopStateValidityStart < data.stopStateValidityEnd;
    },
    {
      path: ['stopStateValidityEnd'],
      message: 'stopStateEndBeforeStart',
    },
  );

export type StopBasicDetailsFormState = z.infer<typeof schema>;
