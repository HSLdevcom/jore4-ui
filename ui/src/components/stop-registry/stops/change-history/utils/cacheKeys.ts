import { QuayVersionSpecifier, StopPlaceVersionSpecifier } from '../types';

export function identifyVersionedStopPlace(
  version: StopPlaceVersionSpecifier,
): string {
  return `${version.stopPlaceNetexId}|${version.stopPlaceVersion}`;
}

export function identifyVersionedQuay(version: QuayVersionSpecifier): string {
  return `${version.netexId}|${version.version}`;
}
