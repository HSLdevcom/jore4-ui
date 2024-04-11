import { z } from 'zod';
import { StopPlaceSignType } from '../../../../../types/stop-registry';

export const signageDetailsFormSchema = z.object({
  signType: z.nativeEnum(StopPlaceSignType),
  numberOfFrames: z.number(),
  lineSignage: z.boolean(),
  replacesRailSign: z.boolean(),
  mainLineSign: z.boolean(),
  signageInstructionExceptions: z.string(),
});

export type SignageDetailsFormState = z.infer<typeof signageDetailsFormSchema>;
