import { z } from 'zod';
import {
  REQUIRED_FIELD_ERROR_MESSAGE,
  schema as changeValidityFormSchema,
  reasonForChangeFormSchema,
  refineValidityPeriodSchema,
  requiredNumber,
  requiredString,
} from '../../common';
import { stopModalStopAreaFormSchema } from './StopModalStopAreaFormSchema';

export const MISSING_ID = 'MISSING_ID';

const publicCodeSchema = z.object({
  value: requiredString,
  municipality: z.string().nullable(),
  expectedPrefix: z.string().nullable(),
});

export type StopPublicCodeState = z.infer<typeof publicCodeSchema>;

const keyValueSchema = z.object({
  key: requiredString,
  values: z.array(z.string().nullable()),
});

export const stopFormSchema = z
  .object({
    stopId: z.string().uuid().optional(), // for stops that are edited
    quayId: z.string().optional(), // for stops that are edited
    stopArea: stopModalStopAreaFormSchema.nullable(),
    publicCode: publicCodeSchema.required(),
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
    locationFin: z.string().nullable().optional(),
    locationSwe: z.string().nullable().optional(),
    timingPlaceId: z.string().uuid().nullable().optional(),
    keyValues: z.array(keyValueSchema).optional(),
  })
  .merge(reasonForChangeFormSchema)
  .merge(changeValidityFormSchema)
  .superRefine((stop, ctx) => {
    // We should either have both a StopPoint and a Quay ID, or neither.
    if (!!stop.stopId !== !!stop.quayId) {
      ctx.addIssue({
        code: 'custom',
        message: MISSING_ID,
        path: ['stopId'],
      });
    }

    // If we don't have a StopArea selected
    if (!stop.stopArea?.netexId) {
      ctx.addIssue({
        code: 'custom',
        message: REQUIRED_FIELD_ERROR_MESSAGE,
        path: ['stopArea'],
      });
    }
  })
  .superRefine(refineValidityPeriodSchema);

export type StopFormState = z.infer<typeof stopFormSchema>;
