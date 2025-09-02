import { z } from 'zod';
import {
  StopRegistryDisplayType,
  StopRegistryInfoSpotType,
} from '../../../../../../generated/graphql';
import {
  createNullableEnum,
  nullableBoolean,
} from '../../../../../forms/common';
import {
  itemSizeSchema,
  posterSchema,
} from '../../../../stops/stop-details/info-spots/types';

export const terminalInfoSpotSchema = z.object({
  infoSpotId: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  backlight: nullableBoolean,
  description: z.object({
    lang: z.string().nullable(),
    value: z.string().nullable(),
  }),
  displayType: createNullableEnum<StopRegistryDisplayType>(),
  floor: z.string().nullable(),
  label: z.string().nullable(),
  infoSpotLocations: z.array(z.string().nullable()).nullable(),
  infoSpotType: createNullableEnum<StopRegistryInfoSpotType>(),
  purpose: z.string().nullable(),
  railInformation: z.string().nullable(),
  speechProperty: nullableBoolean,
  zoneLabel: z.string().nullable(),
  poster: posterSchema.array().nullable(),
  size: itemSizeSchema,
  toBeDeleted: z.boolean(),
});

export type TerminalInfoSpotFormState = z.infer<typeof terminalInfoSpotSchema>;
