import { z } from 'zod';
import { validityPeriodFormSchema } from '../../../forms/common';

export const selectedStopSchema = z
  .object({
    stopPlaceId: z.string(),
    stopPlaceParentId: z.string().nullable(),
    name: z.string(),
    quayId: z.string(),
    publicCode: z.string(),
  })
  .merge(validityPeriodFormSchema);

export type SelectedStop = z.infer<typeof selectedStopSchema>;
