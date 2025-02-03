import {
  InfoSpotDetailsFragment,
  StopRegistryInfoSpotInput,
} from '../../../generated/graphql';
import {
  mapCompactOrNull,
  omitIdAndTypeName,
  omitTypeName,
} from './copyEntityUtilities';

export function mapInfoSpotToInput(
  infoSpot: InfoSpotDetailsFragment,
): StopRegistryInfoSpotInput {
  return {
    ...omitIdAndTypeName(infoSpot),
    infoSpotLocations: null,
    description: omitTypeName(infoSpot.description),
    poster: mapCompactOrNull(infoSpot.poster, omitTypeName),
  };
}
