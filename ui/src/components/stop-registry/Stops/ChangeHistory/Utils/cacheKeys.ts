import { StopPlaceVersionSpecifier } from '../Types';

export function identifyVersionedStopPlace(
  version: StopPlaceVersionSpecifier,
): string {
  return `${version.stopPlaceNetexId}|${version.stopPlaceVersion}`;
}
