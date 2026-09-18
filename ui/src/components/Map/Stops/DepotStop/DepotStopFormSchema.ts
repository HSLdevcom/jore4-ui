import { z } from 'zod';
import { requiredNumber, requiredString } from '../../../../utils';

export const depotStopFormSchema = z.object({
  label: requiredString,
  latitude: requiredNumber.min(-180).max(180),
  longitude: requiredNumber.min(-180).max(180),
});

export type DepotStopFormState = z.infer<typeof depotStopFormSchema>;
