import isEmpty from 'lodash/isEmpty';
import { z } from 'zod';
import { SubstituteDayOfWeek } from '../../../../types/enums';
import { requiredDate } from '../../../forms/common/customZodSchemas';

interface CommonDay {
  created: boolean;
  fromDatabase: boolean;
  substituteDayOfWeek: string | SubstituteDayOfWeek;
  lineTypes: string;
  periodId?: string;
  periodName: string;
  supersededDate: string;
  isPreset: boolean;
}

type CommonDayProperty = 'substituteDayOfWeek' | 'lineTypes';

const commonDayValidation = (
  data: CommonDay,
  property: CommonDayProperty,
): boolean => {
  if (data.created && !data.fromDatabase) {
    return !isEmpty(data[property]);
  }
  return true;
};

const commonDay = z
  .object({
    periodId: z.string().optional(),
    periodName: z.string(),
    supersededDate: requiredDate,
    substituteDayOfWeek: z.nativeEnum(SubstituteDayOfWeek).or(z.string()),
    lineTypes: z.string(),
    fromDatabase: z.boolean(),
    created: z.boolean(),
    isPreset: z.boolean(),
  })
  .refine((data) => commonDayValidation(data, 'substituteDayOfWeek'), {
    message: 'substituteDayOfWeek',
    path: ['substituteDayOfWeek'],
  })
  .refine((data) => commonDayValidation(data, 'lineTypes'), {
    message: 'lineTypes',
    path: ['lineTypes'],
  });

export const schema = z.object({
  commonDays: commonDay.array(),
});

export type CommonDayType = z.infer<typeof commonDay>;

export type FormState = z.infer<typeof schema>;
