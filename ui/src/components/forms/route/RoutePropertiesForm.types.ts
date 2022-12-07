import { z } from 'zod';
import { RouteDirection } from '../../../types/RouteDirection';
import {
  localizedStringRequired,
  nullableNumber,
  requiredString,
  requiredUuid,
} from '../common';
import {
  FormState as ConfirmSaveFormState,
  schema as confirmSaveFormSchema,
} from '../common/ConfirmSaveForm';

export const namesSchema = z.object({
  name: localizedStringRequired,
  shortName: localizedStringRequired,
});

export const routeFormSchema = z
  .object({
    label: requiredString,
    finnishName: requiredString,
    onLineId: requiredUuid,
    direction: z.nativeEnum(RouteDirection),
    origin: namesSchema.required(),
    destination: namesSchema.required(),
    variant: nullableNumber,
  })
  .merge(confirmSaveFormSchema);

export type RouteFormState = z.infer<typeof routeFormSchema> &
  ConfirmSaveFormState;
