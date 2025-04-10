import { z } from 'zod';
import { requiredString } from './customZodSchemas';

export const stopRegistryNamedEntitySchema = z.object({
  nameFin: requiredString,
  nameSwe: z.string().optional(),
  locationFin: z.string().optional(),
  locationSwe: z.string().optional(),
  nameLongFin: z.string().optional(),
  nameLongSwe: z.string().optional(),
  abbreviationFin: z.string().optional(),
  abbreviationSwe: z.string().optional(),
});

export type StopRegistryNamedEntityFormState = z.infer<
  typeof stopRegistryNamedEntitySchema
>;
