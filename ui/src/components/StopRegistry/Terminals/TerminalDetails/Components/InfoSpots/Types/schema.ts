import { z } from 'zod';
import { infoSpotSchema } from '../../../../../Components/InfoSpots';

export const terminalInfoSpotSchema = z
  .object({
    latitude: z.number(),
    longitude: z.number(),
  })
  .merge(infoSpotSchema);

export type TerminalInfoSpotFormState = z.infer<typeof terminalInfoSpotSchema>;
