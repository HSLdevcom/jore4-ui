import { z } from 'zod';
import { TimetablePriority } from '../../../types/enums';
import { timetableImportStrategyFormSchema } from './TimetableImportStrategyForm';
import { timetablesImportPriorityFormSchema } from './TimetablesImportPriorityForm';

export const timetablesImportFormSchema =
  timetablesImportPriorityFormSchema.merge(timetableImportStrategyFormSchema);
export type FormState = z.infer<typeof timetablesImportFormSchema>;

const defaultValues: Partial<FormState> = {
  timetableImportStrategy: 'replace',
  // No default for priority, this is on purpose: design decision.
};
export const getDefaultValues = ({
  importingSomeSpecialDays,
}: {
  importingSomeSpecialDays: boolean;
}): Partial<FormState> => {
  if (importingSomeSpecialDays) {
    return {
      ...defaultValues,
      priority: TimetablePriority.Special,
    };
  }
  return defaultValues;
};
