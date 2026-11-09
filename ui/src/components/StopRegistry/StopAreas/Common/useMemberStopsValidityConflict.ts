import compact from 'lodash/compact';
import { useMemo } from 'react';
import { EnrichedStopPlace } from '../../../../types';
import {
  KnownValueKey,
  findKeyValueParsed,
  getValidityContainmentViolation,
} from '../../../../utils';
import { parseDate } from '../../../../utils/time';
import { mapDateInputToValidityEnd } from '../../../common/Forms';

export type ConflictingMemberStop = {
  readonly publicCode: string | null;
  readonly validityStart: Temporal.PlainDate;
  readonly validityEnd: Temporal.PlainDate | null;
};

type MemberStopsValidityConflictParams = {
  // Member stops are read from the stop area being edited, so no extra query
  // is needed to run this check.
  readonly area?: EnrichedStopPlace | null;
  readonly validityStart?: string;
  readonly validityEnd?: string | null;
  readonly indefinite?: boolean;
};

type MemberStopsValidityConflictResult = {
  readonly hasConflict: boolean;
  readonly conflictingMemberStops: ReadonlyArray<ConflictingMemberStop>;
};

const NO_CONFLICT: MemberStopsValidityConflictResult = {
  hasConflict: false,
  conflictingMemberStops: [],
};

function isSameDate(
  date: Temporal.PlainDate | null | undefined,
  other: Temporal.PlainDate | null | undefined,
): boolean {
  if (!date || !other) {
    return !date && !other;
  }

  return Temporal.PlainDate.compare(date, other) === 0;
}

function isValidityUnchanged(
  area: EnrichedStopPlace,
  validityStart: Temporal.PlainDate,
  validityEnd: Temporal.PlainDate | null,
): boolean {
  return (
    isSameDate(parseDate(area.validityStart), validityStart) &&
    isSameDate(parseDate(area.validityEnd), validityEnd)
  );
}

function findConflictingMemberStops(
  area: EnrichedStopPlace,
  areaValidityStart: Temporal.PlainDate,
  areaValidityEnd: Temporal.PlainDate | null,
): ReadonlyArray<ConflictingMemberStop> {
  const memberStops = compact(area.quays).map((quay) => ({
    publicCode: quay.publicCode ?? null,
    validityStart: findKeyValueParsed(
      quay,
      KnownValueKey.ValidityStart,
      parseDate,
    ),
    validityEnd: findKeyValueParsed(quay, KnownValueKey.ValidityEnd, parseDate),
  }));

  return memberStops.filter(
    (stop): stop is ConflictingMemberStop =>
      // Member stops without a validity start have incomplete data, which
      // cannot be meaningfully compared against the stop area's validity.
      !!stop.validityStart &&
      getValidityContainmentViolation(
        { validity_start: stop.validityStart, validity_end: stop.validityEnd },
        { validity_start: areaValidityStart, validity_end: areaValidityEnd },
      ) !== null,
  );
}

/**
 * Live check whether the stop area's validity period still covers the validity
 * periods of all of its member stops, so the user can be warned before saving.
 * Only edits to the validity period are checked, so that an already
 * inconsistent stop area can still be edited in other ways.
 */
export function useMemberStopsValidityConflict({
  area,
  validityStart,
  validityEnd,
  indefinite,
}: MemberStopsValidityConflictParams): MemberStopsValidityConflictResult {
  return useMemo(() => {
    const areaValidityStart = parseDate(validityStart);

    // Missing start date is handled by the required field validation, not here.
    if (!area || !areaValidityStart) {
      return NO_CONFLICT;
    }

    // An empty end date without the indefinite flag is an incomplete input;
    // let the form validation report it instead of throwing here.
    if (!indefinite && !validityEnd) {
      return NO_CONFLICT;
    }

    const areaValidityEnd =
      mapDateInputToValidityEnd(validityEnd ?? undefined, indefinite) ?? null;

    if (isValidityUnchanged(area, areaValidityStart, areaValidityEnd)) {
      return NO_CONFLICT;
    }

    const conflictingMemberStops = findConflictingMemberStops(
      area,
      areaValidityStart,
      areaValidityEnd,
    );

    return {
      hasConflict: conflictingMemberStops.length > 0,
      conflictingMemberStops,
    };
  }, [area, validityStart, validityEnd, indefinite]);
}
