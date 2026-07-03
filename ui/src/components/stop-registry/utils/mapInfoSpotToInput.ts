import {
  InfoSpotDetailsFragment,
  StopRegistryInfoSpotInput,
} from '../../../generated/graphql';
import { KnownValueKey, patchKeyValues } from '../../../utils';
import {
  mapCompactOrNull,
  mapGeoJsonToInput,
  omitIdVersionAndTypeName,
  omitTypeName,
} from './copyEntityUtilities';

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
    poster: mapCompactOrNull(infoSpot.poster, omitIdVersionAndTypeName),
    railInformation: infoSpot.railInformation,
    speechProperty: infoSpot.speechProperty,
    width: infoSpot.width,
    zoneLabel: infoSpot.zoneLabel,
    keyValues: patchKeyValues(infoSpot, [
      { key: KnownValueKey.SortOrder, values: [index.toString()] },
    ]),
  };
}
