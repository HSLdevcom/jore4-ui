import { z } from 'zod';
import { StopPlaceSignType } from '../../../../../types/stop-registry';
import { nullableNumber } from '../../../../forms/common';

export const signageDetailsFormSchema = z.object({
  signType: z.nativeEnum(StopPlaceSignType).optional().nullable(),
  numberOfFrames: nullableNumber,
  lineSignage: z.boolean().optional().nullable(),
  replacesRailSign: z.boolean().optional().nullable(),
  mainLineSign: z.boolean().optional().nullable(),
  signageInstructionExceptions: z.string().optional().nullable(),
});

export type SignageDetailsFormState = z.infer<typeof signageDetailsFormSchema>;
