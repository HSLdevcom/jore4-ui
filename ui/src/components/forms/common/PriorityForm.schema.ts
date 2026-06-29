import { z } from 'zod';
import { Priority } from '../../../types/enums';

export const priorityFormSchema = z.object({
  priority: z.nativeEnum(Priority),
});

export type PriorityFormState = z.infer<typeof priorityFormSchema>;
