import { z } from 'zod';
import {
  refineValidityPeriodSchema,
  requiredNumber,
  requiredString,
  validityPeriodFormSchema,
} from '../../../common/Forms';

export const depotStopFormSchema = z
  .object({
    label: requiredString,
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
    timingPlaceId: z.string().uuid().nullable().optional(),
  })
  .merge(validityPeriodFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type DepotStopFormState = z.infer<typeof depotStopFormSchema>;
