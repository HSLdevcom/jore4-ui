import { z } from 'zod';
import { RouteDirection } from '../../../types/RouteDirection';
import {
  localizedStringRequired,
  nullablePositiveNumber,
  requiredString,
  requiredUuid,
} from '../../../utils';
import {
  ChangeValidityFormState,
  changeValidityFormSchema,
  refineValidityPeriodSchema,
} from '../../forms/common';

const namesSchema = z.object({
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
  ChangeValidityFormState;
