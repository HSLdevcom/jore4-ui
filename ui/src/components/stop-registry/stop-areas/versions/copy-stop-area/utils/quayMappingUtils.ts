import { QuayDetailsFragment } from '../../../../../../generated/graphql';
import { parseDate } from '../../../../../../time';
import { findKeyValue } from '../../../../../../utils';
import { BidirectionalQuayMap } from '../types';

function matchQuayDates(
  newQuay: QuayDetailsFragment,
  oldQuayValidityStart: string,
  oldQuayValidityEnd: string | null,
): boolean {
  const newQuayValidityStart = findKeyValue(newQuay, 'validityStart');
  const newQuayValidityEnd = findKeyValue(newQuay, 'validityEnd');

  if (!newQuayValidityStart) {
    return false;
  }

  const startsOneDayAfterOldEnd =
    !!oldQuayValidityEnd &&
    parseDate(newQuayValidityStart).equals(
      parseDate(oldQuayValidityEnd).plus({ days: 1 }),
    );

  const endsOneDayBeforeOldStart =
    !!newQuayValidityEnd &&
    parseDate(newQuayValidityEnd).equals(
      parseDate(oldQuayValidityStart).minus({ days: 1 }),
    );

  return startsOneDayAfterOldEnd || endsOneDayBeforeOldStart;
}

function findMatchingNewQuay(
  oldQuay: QuayDetailsFragment,
  newQuays: ReadonlyArray<QuayDetailsFragment>,
): QuayDetailsFragment | null {
  if (!oldQuay?.id || !oldQuay?.publicCode) {
    return null;
  }

  const oldQuayPublicCode = oldQuay.publicCode;
  const oldQuayValidityStart = findKeyValue(oldQuay, 'validityStart');
  const oldQuayValidityEnd = findKeyValue(oldQuay, 'validityEnd');
  if (!oldQuayValidityStart) {
    return null;
  }

  // Find all new quays with the same public code
  const newQuaysWithSamePublicCode = newQuays.filter(
    (q) => q.publicCode === oldQuayPublicCode,
  );

  // Compare the start and end dates to find the correct match
  const matchingNewQuay = newQuaysWithSamePublicCode.find((newQuay) =>
    matchQuayDates(newQuay, oldQuayValidityStart, oldQuayValidityEnd),
  );

  if (!matchingNewQuay?.id) {
    return null;
  }

  return matchingNewQuay;
}

/**
 * Creates a bidirectional mapping between old quays and new quays based on public code and validity dates.
 */
export function createBidirectionalQuayMapping(
  oldQuays: ReadonlyArray<QuayDetailsFragment>,
  newQuays: ReadonlyArray<QuayDetailsFragment>,
): BidirectionalQuayMap {
  const copiedQuays = new Map<string, QuayDetailsFragment>();
  const originalQuays = new Map<string, QuayDetailsFragment>();

  oldQuays.forEach((oldQuay) => {
    if (!oldQuay?.id) {
      return;
    }

    const matchingNewQuay = findMatchingNewQuay(oldQuay, newQuays);
    if (!matchingNewQuay?.id) {
      return;
    }

    copiedQuays.set(oldQuay.id, matchingNewQuay);
    originalQuays.set(matchingNewQuay.id, oldQuay);
  });

  return { copiedQuays, originalQuays };
}
