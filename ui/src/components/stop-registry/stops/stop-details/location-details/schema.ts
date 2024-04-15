import { z } from 'zod';

export const locationDetailsFormSchema = z.object({
  streetAddress: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  latitude: z.number(),
  longitude: z.number(),
  altitude: z.number(),
  functionalArea: z
    .union([z.number().min(0), z.nan(), z.undefined(), z.null()])
    .transform((fa) => (Number.isNaN(fa) ? undefined : fa)),
});

export type LocationDetailsFormState = z.infer<
  typeof locationDetailsFormSchema
>;
