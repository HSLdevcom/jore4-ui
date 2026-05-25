import { StopPlaceVersionSpecifier } from '../types';

export function identifyVersionedStopPlace(
  version: StopPlaceVersionSpecifier,
): string {
  return `${version.stopPlaceNetexId}|${version.stopPlaceVersion}`;
}
