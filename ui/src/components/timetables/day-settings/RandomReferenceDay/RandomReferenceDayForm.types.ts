import { z } from 'zod';
import { SubstituteDayOfWeek } from '../../../../types/enums';
import {
  requiredDate,
  requiredInterval,
  requiredString,
} from '../../../forms/common/customZodSchemas';

const periodSchema = z.object({
  periodId: z.string().optional(),
  periodName: requiredString,
  beginDate: requiredDate,
  endDate: requiredDate,
  beginTime: requiredInterval,
  endTime: requiredInterval,
  substituteDayOfWeek: z.nativeEnum(SubstituteDayOfWeek),
  lineTypes: z.string(),
});

export const randomReferenceDayFormSchema = z.object({
  periods: periodSchema.array(),
});

export type PeriodType = z.infer<typeof periodSchema>;

export type RandomReferenceFormState = z.infer<
  typeof randomReferenceDayFormSchema
>;
