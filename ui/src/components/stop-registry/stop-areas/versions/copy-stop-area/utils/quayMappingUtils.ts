import { DateTime } from 'luxon';
import { QuayDetailsFragment } from '../../../../../../generated/graphql';
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
    DateTime.fromISO(newQuayValidityStart).equals(
      DateTime.fromISO(oldQuayValidityEnd).plus({ days: 1 }),
    );

  const endsOneDayBeforeOldStart =
    !!newQuayValidityEnd &&
    DateTime.fromISO(newQuayValidityEnd).equals(
      DateTime.fromISO(oldQuayValidityStart).minus({ days: 1 }),
    );

  return startsOneDayAfterOldEnd || endsOneDayBeforeOldStart;
}

function findMatchingNewQuay(
  oldQuay: QuayDetailsFragment,
  newQuays: ReadonlyArray<QuayDetailsFragment>,
): QuayDetailsFragment | undefined {
  if (!oldQuay?.id || !oldQuay?.publicCode) {
    return undefined;
  }

  const oldQuayPublicCode = oldQuay.publicCode;
  const oldQuayValidityStart = findKeyValue(oldQuay, 'validityStart');
  const oldQuayValidityEnd = findKeyValue(oldQuay, 'validityEnd');
  if (!oldQuayValidityStart) {
    return undefined;
  }

  // Find all new quays with the same public code
  const newQuaysWithSamePublicCode = newQuays.filter(
    (q) => q.publicCode === oldQuayPublicCode,
  );

  // Compare the start and end dates to find the correct match
  const matchingNewQuay = newQuaysWithSamePublicCode.find((newQuay) =>
    matchQuayDates(newQuay, oldQuayValidityStart, oldQuayValidityEnd),
  );

  if (!matchingNewQuay || !matchingNewQuay.id) {
    return undefined;
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
    if (!matchingNewQuay || !matchingNewQuay.id) {
      return;
    }

    copiedQuays.set(oldQuay.id, matchingNewQuay);
    originalQuays.set(matchingNewQuay.id, oldQuay);
  });

  return { copiedQuays, originalQuays };
}
