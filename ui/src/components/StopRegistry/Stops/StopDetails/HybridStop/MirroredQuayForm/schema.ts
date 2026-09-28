import { z } from 'zod';
import { StopPlaceState } from '../../../../../../types/stop-registry';
import { reasonForChangeFormSchema } from '../../../../../common/Forms';

export const mirroredQuayFormSchema = z
  .object({
    stopState: z.nativeEnum(StopPlaceState),
    trunkLineStop: z.boolean(),
    speedTramStop: z.boolean(),
  })
  .merge(reasonForChangeFormSchema);

export type MirroredQuayFormState = z.infer<typeof mirroredQuayFormSchema>;
