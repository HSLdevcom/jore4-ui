import { z } from 'zod';
import {
  schema as changeValidityFormSchema,
  requiredNumber,
  requiredString,
} from '../../common';
import { stopModalStopAreaFormSchema } from './StopModalStopAreaFormSchema';

export const stopFormSchema = z
  .object({
    stopId: z.string().uuid().optional(), // for stops that are edited
    stopArea: stopModalStopAreaFormSchema.nullable(),
    label: requiredString,
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
    timingPlaceId: z.string().uuid().nullable(),
  })
  .merge(changeValidityFormSchema);

export type StopFormState = z.infer<typeof stopFormSchema>;
