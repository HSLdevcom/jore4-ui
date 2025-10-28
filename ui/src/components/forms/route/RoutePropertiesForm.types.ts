import { z } from 'zod';
import { RouteDirection } from '../../../types/RouteDirection';
import {
  localizedStringRequired,
  nullablePositiveNumber,
  refineValidityPeriodSchema,
  requiredString,
  requiredUuid,
} from '../common';
import {
  FormState as ChangeValidityFormFormState,
  schema as changeValidityFormSchema,
} from '../common/ChangeValidityForm';

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
    variant: nullablePositiveNumber,
  })
  .merge(changeValidityFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type RouteFormState = z.infer<typeof routeFormSchema> &
  ChangeValidityFormFormState;
