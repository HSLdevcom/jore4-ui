import { z } from 'zod';
import { infoSpotSchema } from '../../../../stops/stop-details/info-spots/types';

export const terminalInfoSpotSchema = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
  })
  .merge(infoSpotSchema);

export type TerminalInfoSpotFormState = z.infer<typeof terminalInfoSpotSchema>;
