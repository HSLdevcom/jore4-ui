import { z } from 'zod';
import { timetableImportStrategyFormSchema } from './TimetableImportStrategyForm';
import { timetablesImportPriorityFormSchema } from './TimetablesImportPriorityForm';

export const timetablesImportFormSchema =
  timetablesImportPriorityFormSchema.merge(timetableImportStrategyFormSchema);
export type FormState = z.infer<typeof timetablesImportFormSchema>;
