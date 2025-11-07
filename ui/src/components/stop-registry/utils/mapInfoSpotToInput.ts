import {
  InfoSpotDetailsFragment,
  StopRegistryInfoSpotInput,
} from '../../../generated/graphql';
import {
  mapCompactOrNull,
  mapGeoJsonToInput,
  omitIdAndTypeName,
  omitTypeName,
} from './copyEntityUtilities';

export function mapInfoSpotToInput(
  infoSpot: InfoSpotDetailsFragment,
): StopRegistryInfoSpotInput {
  return {
    ...omitIdAndTypeName(infoSpot),
    geometry: mapGeoJsonToInput(infoSpot.geometry),
    infoSpotLocations: null,
    description: omitTypeName(infoSpot.description),
    poster: mapCompactOrNull(infoSpot.poster, omitIdAndTypeName),
  };
}
