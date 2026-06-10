import { z } from 'zod';
import { StopPlaceState } from '../../../../../../types/stop-registry';
import { reasonForChangeFormSchema } from '../../../../../forms/common';

export const mirroredQuayFormSchema = z
  .object({
    stopState: z.nativeEnum(StopPlaceState),
  })
  .merge(reasonForChangeFormSchema);

export type MirroredQuayFormState = z.infer<typeof mirroredQuayFormSchema>;
