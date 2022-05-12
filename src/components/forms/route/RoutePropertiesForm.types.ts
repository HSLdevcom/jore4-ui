import { z } from 'zod';
import { RouteDirection } from '../../../types/RouteDirection';
import {
  FormState as ConfirmSaveFormState,
  schema as confirmSaveFormSchema,
} from '../common/ConfirmSaveForm';

export const routeFormSchema = z
  .object({
    label: z.string().min(1),
    finnishName: z.string().min(1),
    on_line_id: z.string().uuid().min(1),
    direction: z.nativeEnum(RouteDirection),
  })
  .merge(confirmSaveFormSchema);

export type RouteFormState = z.infer<typeof routeFormSchema> &
  ConfirmSaveFormState;
