import { z } from 'zod';
import { SubstituteDayOfWeek } from '../../../../types/enums';
import { requiredDate } from '../../../forms/common/customZodSchemas';

const commonDay = z.object({
  periodId: z.string().optional(),
  periodName: z.string(),
  supersededDate: requiredDate,
  substituteDayOfWeek: z.nativeEnum(SubstituteDayOfWeek),
  lineTypes: z.string(),
  fromDatabase: z.boolean(),
  created: z.boolean(),
  isPreset: z.boolean(),
});

export const schema = z.object({
  commonDays: commonDay.array(),
});

export type CommonDayType = z.infer<typeof commonDay>;

export type FormState = z.infer<typeof schema>;
