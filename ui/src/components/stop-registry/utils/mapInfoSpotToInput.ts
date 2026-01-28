import {
  InfoSpotDetailsFragment,
  StopRegistryInfoSpotInput,
} from '../../../generated/graphql';
import {
  mapCompactOrNull,
  mapGeoJsonToInput,
  omitIdVersionAndTypeName,
  omitTypeName,
} from './copyEntityUtilities';

export function mapInfoSpotToInput(
  infoSpot: InfoSpotDetailsFragment,
): StopRegistryInfoSpotInput {
  return {
    ...omitIdVersionAndTypeName(infoSpot),
    geometry: mapGeoJsonToInput(infoSpot.geometry),
    infoSpotLocations: null,
    description: omitTypeName(infoSpot.description),
    poster: mapCompactOrNull(infoSpot.poster, omitIdVersionAndTypeName),
  };
}
