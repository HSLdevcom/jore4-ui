import { z } from 'zod';
import { RouteDirection } from '../../../types/RouteDirection';
import {
  FormState as ConfirmSaveFormState,
  schema as confirmSaveFormSchema,
} from '../common/ConfirmSaveForm';
import { localizedStringRequired } from '../common/LocalizedStringSchema';

export const namesSchema = z.object({
  name: localizedStringRequired,
  shortName: localizedStringRequired,
});

export const routeFormSchema = z
  .object({
    label: z.string().min(1),
    finnishName: z.string().min(1),
    on_line_id: z.string().uuid().min(1),
    direction: z.nativeEnum(RouteDirection),
    origin: namesSchema.required(),
    destination: namesSchema.required(),
  })
  .merge(confirmSaveFormSchema);

export type RouteFormState = z.infer<typeof routeFormSchema> &
  ConfirmSaveFormState;
