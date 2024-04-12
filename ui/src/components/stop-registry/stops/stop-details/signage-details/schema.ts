import { z } from 'zod';
import { StopPlaceSignType } from '../../../../../types/stop-registry';

export const signageDetailsFormSchema = z.object({
  signType: z.nativeEnum(StopPlaceSignType).optional().nullable(),
  numberOfFrames: z
    .union([z.number().min(0), z.nan(), z.undefined(), z.null()])
    .transform((v) => (Number.isNaN(v) ? undefined : v)),
  lineSignage: z.boolean().optional().nullable(),
  replacesRailSign: z.boolean().optional().nullable(),
  mainLineSign: z.boolean().optional().nullable(),
  signageInstructionExceptions: z.string().optional().nullable(),
});

export type SignageDetailsFormState = z.infer<typeof signageDetailsFormSchema>;
