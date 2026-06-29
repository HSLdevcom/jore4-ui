import { z } from 'zod';
import { RouteDirection } from '../../../types/RouteDirection';
import {
  FormState as ChangeValidityFormFormState,
  schema as changeValidityFormSchema,
} from '../common/ChangeValidityForm.schema';
import {
  localizedStringRequired,
  nullablePositiveNumber,
  requiredString,
  requiredUuid,
} from '../common/customZodSchemas';
import { refineValidityPeriodSchema } from '../common/ValidityPeriodForm.schema';

export const namesSchema = z.object({
  name: localizedStringRequired,
  shortName: localizedStringRequired,
});

// Keep in sync with: EditedRouteMetadata in ui/src/redux/slices/mapRouteEditor.ts
export const routeFormSchema = z
  .object({
    label: requiredString,
    finnishName: requiredString,
    onLineId: requiredUuid,
    direction: z.nativeEnum(RouteDirection),
    origin: namesSchema.required(),
    destination: namesSchema.required(),
    variant: nullablePositiveNumber,
    versionComment: z.string().optional(),
  })
  .merge(changeValidityFormSchema)
  .superRefine(refineValidityPeriodSchema);

export type RouteFormState = z.infer<typeof routeFormSchema> &
  ChangeValidityFormFormState;
