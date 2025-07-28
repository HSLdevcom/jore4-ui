import compact from 'lodash/compact';
import { InfoSpotDetailsFragment } from '../../../../../../generated/graphql';
import { InfoSpotState, ItemSizeState, SizedDbItem } from '../types';

function determineItemSize({
  width = null,
  height = null,
}: SizedDbItem): ItemSizeState {
  if (width !== null && height !== null) {
    return { uiState: 'EXISTING', width, height };
  }

  return { uiState: 'UNKNOWN', width, height };
}

export function mapInfoSpotDataToFormState(
  infoSpot: InfoSpotDetailsFragment,
): InfoSpotState {
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
    size: determineItemSize(infoSpot),
    infoSpotLocations: infoSpot.infoSpotLocations ?? null,
    infoSpotType: infoSpot.infoSpotType ?? null,
    purpose: infoSpot.purpose ?? null,
    railInformation: infoSpot.railInformation ?? null,
    speechProperty: infoSpot.speechProperty ?? null,
    zoneLabel: infoSpot.zoneLabel ?? null,
    poster: compact(infoSpot.poster).map((poster) => ({
      label: poster.label ?? null,
      lines: poster.lines ?? null,
      size: determineItemSize(poster),
      toBeDeletedPoster: false,
    })),
    toBeDeleted: false,
  };
}
