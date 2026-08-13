import compact from 'lodash/compact';
import {
  AccessibilityAssessmentDetailsFragment,
  InfoSpotDetailsFragment,
  PosterDetailsFragment,
} from '../../../generated/graphql';
import {
  EnrichedQuay,
  PosterWithSortOrder,
  Quay,
  StopPlaceInfoSpots,
} from '../../../types';
import {
  KnownValueKey,
  comparePrimitive,
  compareValues,
  findKeyValueParsed,
  getQuayDetailsForEnrichment,
} from '../../../utils';

function sortBySortOrder<T extends { sortOrder?: number | null }>(
  items: ReadonlyArray<T>,
): Array<T> {
  return items.toSorted((a, b) =>
    compareValues(a.sortOrder, b.sortOrder, comparePrimitive),
  );
}

function sortPosters(
  posters: ReadonlyArray<PosterDetailsFragment | null> | undefined | null,
): Array<PosterWithSortOrder> {
  return sortBySortOrder(
    compact(posters).map((poster) => {
      const sortOrder = findKeyValueParsed(
        poster,
        KnownValueKey.SortOrder,
        parseInt,
      );
      return { ...poster, sortOrder };
    }),
  );
}

export function enrichInfoSpot(
  infoSpot: InfoSpotDetailsFragment,
): StopPlaceInfoSpots {
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
  return sortBySortOrder(compact(infoSpots).map(enrichInfoSpot));
}

export function mapToEnrichedQuay(
  quay: Quay | null | undefined,
  accessibilityAssessment:
    AccessibilityAssessmentDetailsFragment | null | undefined,
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
