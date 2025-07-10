import isEmpty from 'lodash/isEmpty';
import { z } from 'zod';
import { SubstituteDayOfWeek } from '../../../../types/enums';
import { requiredDate } from '../../../forms/common/customZodSchemas';

type CommonDay = {
  readonly created: boolean;
  readonly fromDatabase: boolean;
  readonly substituteDayOfWeek: string | SubstituteDayOfWeek;
  readonly lineTypes: string;
  readonly periodId?: string;
  readonly periodName: string;
  readonly supersededDate: string;
  readonly isPreset: boolean;
};

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
    toBeDeleted: z.boolean().optional(),
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

export type UpdateField = 'created' | 'toBeDeleted';
