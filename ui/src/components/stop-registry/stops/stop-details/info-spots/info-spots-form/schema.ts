import { z } from 'zod';
import {
  InfoSpotDetailsFragment,
  StopRegistryDisplayType,
  StopRegistryInfoSpotType,
  StopRegistryPosterPlaceSize,
} from '../../../../../../generated/graphql';
import {
  createNullableEnum,
  nullableBoolean,
} from '../../../../../forms/common';

const infoSpotSchema = z.object({
  infoSpotId: z.string().nullable(),
  posterPlaceSize: createNullableEnum<StopRegistryPosterPlaceSize>(),
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
  maintenance: z.string().nullable(),
  poster: z
    .object({
      label: z.string().nullable(),
      posterSize: createNullableEnum<StopRegistryPosterPlaceSize>(),
      lines: z.string().nullable(),
    })
    .array()
    .nullable(),
});

export const InfoSpotsFormSchema = z.object({
  infoSpots: z.array(infoSpotSchema),
});

export type InfoSpotState = z.infer<typeof infoSpotSchema>;
export type InfoSpotsFormState = z.infer<typeof InfoSpotsFormSchema>;

export const mapInfoSpotDataToFormState = (
  infoSpot: InfoSpotDetailsFragment,
): InfoSpotState => {
  return {
    infoSpotId: infoSpot.id ?? null,
    backlight: infoSpot.backlight ?? null,
    description: {
      lang: infoSpot.description?.lang ?? null,
      value: infoSpot.description?.value ?? null,
    },
    displayType: infoSpot.displayType ?? null,
    floor: infoSpot.floor ?? null,
    label: infoSpot.label ?? null,
    posterPlaceSize: infoSpot.posterPlaceSize ?? null,
    infoSpotLocations: infoSpot.infoSpotLocations ?? null,
    infoSpotType: infoSpot.infoSpotType ?? null,
    purpose: infoSpot.purpose ?? null,
    railInformation: infoSpot.railInformation ?? null,
    speechProperty: infoSpot.speechProperty ?? null,
    zoneLabel: infoSpot.zoneLabel ?? null,
    maintenance: infoSpot.maintenance ?? null,
    poster:
      infoSpot.poster?.map((p) => ({
        label: p?.label ?? null,
        posterSize: p?.posterSize ?? null,
        lines: p?.lines ?? null,
      })) ?? [],
  };
};
