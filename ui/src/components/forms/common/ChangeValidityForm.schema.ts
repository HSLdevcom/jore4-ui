import { PriorityFormState, priorityFormSchema } from './PriorityForm.schema';
import {
  ValidityPeriodFormState,
  validityPeriodFormSchema,
} from './ValidityPeriodForm.schema';

export const schema = validityPeriodFormSchema.merge(priorityFormSchema);

export type FormState = ValidityPeriodFormState & PriorityFormState;
