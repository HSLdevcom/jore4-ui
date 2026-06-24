import { DateTime } from 'luxon';
import { z } from 'zod';
import { StopPlaceState } from '../../../../../../types/stop-registry';
import { reasonForChangeFormSchema } from '../../../../../forms/common';

export const mirroredQuayFormSchema = z
  .object({
    stopState: z.nativeEnum(StopPlaceState),
    stopStateValidityStart: z.custom<DateTime>(),
    stopStateValidityEnd: z.custom<DateTime>(),
    trunkLineStop: z.boolean(),
    speedTramStop: z.boolean(),
  })
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

export type MirroredQuayFormState = z.infer<typeof mirroredQuayFormSchema>;
