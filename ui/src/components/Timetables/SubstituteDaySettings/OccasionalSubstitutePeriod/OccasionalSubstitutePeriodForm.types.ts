import { z } from 'zod';
import { RouteTypeOfLineEnum } from '../../../../generated/graphql';
import { SubstituteDayOfWeek } from '../../../../types/enums';
import {
  requiredDate,
  requiredInterval,
  requiredString,
  zEnumArrayWithAll,
} from '../../../../utils';

const periodSchema = z.object({
  periodId: z.string().optional(),
  periodName: requiredString,
  beginDate: requiredDate,
  endDate: requiredDate,
  beginTime: requiredInterval,
  endTime: requiredInterval,
  substituteDayOfWeek: z.nativeEnum(SubstituteDayOfWeek),
  lineTypes: zEnumArrayWithAll(RouteTypeOfLineEnum),
  toBeDeleted: z.boolean(),
  isPreset: z.boolean(),
});

export const schema = z.object({
  periods: periodSchema.array(),
});

export type PeriodType = z.infer<typeof periodSchema>;
export type CommonSubstitutePeriodType = Omit<
  PeriodType,
  'beginTime' | 'endTime'
> & {
  beginTime?: never;
  endTime?: never;
};

export type FormState = z.infer<typeof schema>;
