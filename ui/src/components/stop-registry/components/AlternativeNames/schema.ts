import { z } from 'zod';

export const alternativeNamesFormSchema = z.object({
  nameLongFin: z.string().optional(),
  nameLongSwe: z.string().optional(),
  abbreviationFin: z.string().optional(),
  abbreviationSwe: z.string().optional(),
  abbreviationEng: z.string().optional(),
  nameLongEng: z.string().optional(),
  nameEng: z.string().optional(),
});

export type AlternativeNamesSchema = z.infer<typeof alternativeNamesFormSchema>;
