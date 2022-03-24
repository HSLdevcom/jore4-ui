import { z } from 'zod';
import {
  FormState as ConfirmSaveFormState,
  schema as confirmSaveFormSchema,
} from './ConfirmSaveForm';

export const routeFormSchema = z
  .object({
    label: z.string().min(1),
    description_i18n: z.string().min(1),
    on_line_id: z.string().uuid().min(1),
  })
  .merge(confirmSaveFormSchema);

export type RouteFormState = z.infer<typeof routeFormSchema> &
  ConfirmSaveFormState;
