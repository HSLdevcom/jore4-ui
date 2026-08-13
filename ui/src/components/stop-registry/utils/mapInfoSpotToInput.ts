import {
  InfoSpotDetailsFragment,
  PosterDetailsFragment,
  StopRegistryInfoSpotInput,
  StopRegistryPosterInput,
} from '../../../generated/graphql';
import { KnownValueKey, patchKeyValues } from '../../../utils';
import {
  mapCompactOrNull,
  mapGeoJsonToInput,
  omitTypeName,
} from './copyEntityUtilities';

function mapPosterToInput(
  poster: ReadonlyArray<PosterDetailsFragment | null> | null | undefined,
): Array<StopRegistryPosterInput> | null {
  return mapCompactOrNull(poster, (item, index) => ({
    id: item.id,
    height: item.height,
    keyValues: patchKeyValues(item, [
      { key: KnownValueKey.SortOrder, values: [index.toString()] },
    ]),
    label: item.label,
    lines: item.lines,
    width: item.width,
  }));
}

export function mapInfoSpotToInput(
  infoSpot: InfoSpotDetailsFragment,
  index: number,
): StopRegistryInfoSpotInput {
  return {
    id: infoSpot.id,
    backlight: infoSpot.backlight,
    description: omitTypeName(infoSpot.description),
    displayType: infoSpot.displayType,
    floor: infoSpot.floor,
    geometry: mapGeoJsonToInput(infoSpot.geometry),
    height: infoSpot.height,
    infoSpotLocations: null,
    infoSpotType: infoSpot.infoSpotType,
    intendedUser: infoSpot.intendedUser,
    label: infoSpot.label,
    poster: mapPosterToInput(infoSpot.poster),
    railInformation: infoSpot.railInformation,
    speechProperty: infoSpot.speechProperty,
    width: infoSpot.width,
    zoneLabel: infoSpot.zoneLabel,
    keyValues: patchKeyValues(infoSpot, [
      { key: KnownValueKey.SortOrder, values: [index.toString()] },
    ]),
  };
}
