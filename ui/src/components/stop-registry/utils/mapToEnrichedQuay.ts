import compact from 'lodash/compact';
import {
  AccessibilityAssessmentDetailsFragment,
  InfoSpotDetailsFragment,
  StopRegistryPosterInput,
} from '../../../generated/graphql';
import { EnrichedQuay, Quay, StopPlaceInfoSpots } from '../../../types';
import { getQuayDetailsForEnrichment } from '../../../utils';

function sortInfoSpots(
  infoSpots: ReadonlyArray<InfoSpotDetailsFragment | null> | undefined | null,
): Array<StopPlaceInfoSpots> {
  return compact(infoSpots).sort((a, b) =>
    (a.label ?? '').localeCompare(b.label ?? ''),
  );
}

function sortPosters(
  posters: ReadonlyArray<StopRegistryPosterInput | null> | undefined | null,
): Array<StopRegistryPosterInput> {
  return compact(posters).sort((a, b) =>
    (a.label ?? '').localeCompare(b.label ?? ''),
  );
}

export function mapToEnrichedQuay(
  quay: Quay | null | undefined,
  accessibilityAssessment:
    | AccessibilityAssessmentDetailsFragment
    | null
    | undefined,
  changed?: string | null,
  changedByUserName?: string | null,
  timingPlaceData?: {
    timingPlaceId: string | null;
    timingPlaceLabel: string | null;
  },
): EnrichedQuay | null {
  if (!quay) {
    return null;
  }

  const enrichmentProperties = getQuayDetailsForEnrichment(
    quay,
    accessibilityAssessment,
    timingPlaceData,
  );

  return {
    ...quay,
    ...enrichmentProperties,
    changed,
    changedByUserName,
    infoSpots: sortInfoSpots(quay.infoSpots).map((infoSpot) => ({
      ...infoSpot,
      poster: sortPosters(infoSpot.poster),
    })),
  };
}
