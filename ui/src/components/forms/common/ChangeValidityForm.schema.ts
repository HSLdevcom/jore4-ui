import { PriorityFormState, priorityFormSchema } from './PriorityForm.schema';
import {
  ValidityPeriodFormState,
  validityPeriodFormSchema,
} from './ValidityPeriodForm.schema';

export const changeValidityFormSchema =
  validityPeriodFormSchema.merge(priorityFormSchema);

export type ChangeValidityFormState = ValidityPeriodFormState &
  PriorityFormState;
