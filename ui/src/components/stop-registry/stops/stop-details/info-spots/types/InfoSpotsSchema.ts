import { z } from 'zod';
import {
  StopRegistryDisplayType,
  StopRegistryInfoSpotType,
} from '../../../../../../generated/graphql';
import {
  createNullableEnum,
  nullableBoolean,
} from '../../../../../forms/common';

export const itemSizeUiState = z.enum([
  'UNKNOWN', // Width = null, height = null; Default state, or explicitly set.
  'EXISTING', // A known size from a list, or previously set width != null, height != null
  'NEW', // A new size, width and height start as null, but should both be set
]);

export const itemSizeSchema = z.object({
  uiState: itemSizeUiState,
  width: z.number().min(0).nullable(),
  height: z.number().min(0).nullable(),
});

export const posterSchema = z.object({
  label: z.string().nullable(),
  lines: z.string().nullable(),
  size: itemSizeSchema,
  toBeDeletedPoster: z.boolean(),
});

export const infoSpotSchema = z.object({
  infoSpotId: z.string().nullable(),
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

export const InfoSpotsFormSchema = z.object({
  infoSpots: z.array(infoSpotSchema),
});

export type ItemSizeUiState = z.infer<typeof itemSizeUiState>;
export type ItemSizeState = z.infer<typeof itemSizeSchema>;
export type PosterState = z.infer<typeof posterSchema>;
export type InfoSpotState = z.infer<typeof infoSpotSchema>;
export type InfoSpotsFormState = z.infer<typeof InfoSpotsFormSchema>;

export const UnknownMenuItem: ItemSizeState = {
  uiState: 'UNKNOWN',
  width: null,
  height: null,
};

export const NewMenuItem: ItemSizeState = {
  uiState: 'NEW',
  width: null,
  height: null,
};
