import { z } from 'zod';
import {
  ValidityPeriodFormState,
  requiredNumber,
  requiredString,
  validityPeriodFormSchema,
} from '../../forms/common';

export const stopAreaFormSchema = z
  .object({
    label: requiredString,
    name: requiredString,
    latitude: requiredNumber.min(-180).max(180),
    longitude: requiredNumber.min(-180).max(180),
  })
  .merge(validityPeriodFormSchema);

export type StopAreaFormState = z.infer<typeof stopAreaFormSchema> &
  ValidityPeriodFormState;
