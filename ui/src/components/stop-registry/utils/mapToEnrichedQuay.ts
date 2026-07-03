import compact from 'lodash/compact';
import {
  AccessibilityAssessmentDetailsFragment,
  InfoSpotDetailsFragment,
  StopRegistryPosterInput,
} from '../../../generated/graphql';
import { EnrichedQuay, Quay, StopPlaceInfoSpots } from '../../../types';
import {
  KnownValueKey,
  findKeyValueParsed,
  getQuayDetailsForEnrichment,
} from '../../../utils';

function sortPosters(
  posters: ReadonlyArray<StopRegistryPosterInput | null> | undefined | null,
): Array<StopRegistryPosterInput> {
  return compact(posters).sort((a, b) =>
    (a.label ?? '').localeCompare(b.label ?? ''),
  );
}

function enrichInfoSpot(infoSpot: InfoSpotDetailsFragment): StopPlaceInfoSpots {
  const sortOrder = findKeyValueParsed(
    infoSpot,
    KnownValueKey.SortOrder,
    parseInt,
  );
  return {
    ...infoSpot,
    sortOrder,
    poster: sortPosters(infoSpot.poster),
  };
}

function sortInfoSpots(
  infoSpots: ReadonlyArray<InfoSpotDetailsFragment | null> | undefined | null,
): Array<StopPlaceInfoSpots> {
  return compact(infoSpots)
    .map(enrichInfoSpot)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export function mapToEnrichedQuay(
  quay: Quay | null | undefined,
  accessibilityAssessment:
    | AccessibilityAssessmentDetailsFragment
    | null
    | undefined,
  changed?: string | null,
  changedByUserName?: string | null,
): EnrichedQuay | null {
  if (!quay) {
    return null;
  }

  return {
    ...quay,
    ...getQuayDetailsForEnrichment(quay, accessibilityAssessment),
    changed,
    changedByUserName,
    infoSpots: sortInfoSpots(quay.infoSpots),
  };
}
