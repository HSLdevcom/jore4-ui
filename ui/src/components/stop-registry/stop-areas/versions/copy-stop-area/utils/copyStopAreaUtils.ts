import compact from 'lodash/compact';
import omit from 'lodash/omit';
import { DateTime } from 'luxon';
import { StopRegistryQuayInput } from '../../../../../../generated/graphql';
import { EnrichedStopPlace } from '../../../../../../types';
import {
  ElementWithKeyValues,
  findKeyValue,
  patchKeyValues,
} from '../../../../../../utils';
import { mapStopPlaceToInput } from '../../../stop-area-details/mapStopPlaceToInput';
import { CutDirection } from '../../cut-stop-area-validity';
import {
  CopyStopAreaInvalidDateRangeError,
  StopAreaVersionFormState,
} from '../../types';
import { StopRegistryStopAreaCopyInput } from '../types';

// Checks if the given object is valid at any point during the specified period
function isObjectValidDuringPeriod(
  object: ElementWithKeyValues | null | undefined,
  validityStart: string,
  validityEnd?: string,
): boolean {
  if (!object) {
    return false;
  }

  const objectValidityStart = findKeyValue(object, 'validityStart');
  const objectValidityEnd = findKeyValue(object, 'validityEnd');

  // Should not be possible to have object without validity start
  if (!objectValidityStart) {
    return false;
  }

  const objectIsIndefiniteOrIsValidAfterStart: boolean =
    !objectValidityEnd || objectValidityEnd >= validityStart;

  if (validityEnd) {
    return (
      objectValidityStart <= validityEnd &&
      objectIsIndefiniteOrIsValidAfterStart
    );
  }

  return (
    objectValidityStart <= validityStart &&
    objectIsIndefiniteOrIsValidAfterStart
  );
}

function setInputQuayValidityDates(
  quay: StopRegistryQuayInput | null,
  validityStart: string,
  validityEnd?: string,
): StopRegistryQuayInput | null {
  if (!quay) {
    return null;
  }

  const quayValidityStart = findKeyValue(quay, 'validityStart');
  const quayValidityEnd = findKeyValue(quay, 'validityEnd');
  if (!quayValidityStart) {
    // Should not be possible
    return null;
  }

  // Determine if we need to update validityStart
  const shouldUpdateValidityStart = quayValidityStart < validityStart;

  // Determine new validityEnd for quay
  let newValidityEnd: string | undefined;
  if (!validityEnd) {
    // If state validity end is not set, retain original quay end date (do nothing)
    newValidityEnd = quayValidityEnd ?? undefined;
  } else if (!quayValidityEnd || quayValidityEnd > validityEnd) {
    // If quay is indefinite or its end is after the new end, set to new end
    newValidityEnd = validityEnd;
  } else {
    // If quay end is before or equal to new end, keep original
    newValidityEnd = quayValidityEnd;
  }

  return {
    ...quay,
    keyValues: patchKeyValues(
      quay,
      compact([
        shouldUpdateValidityStart
          ? {
              key: 'validityStart',
              values: [validityStart],
            }
          : undefined,
        newValidityEnd
          ? {
              key: 'validityEnd',
              values: [newValidityEnd],
            }
          : undefined,
      ]),
    ).filter((kv) => (kv?.key !== 'validityEnd' ? true : !!newValidityEnd)),
  };
}

export function mapToStopAreaCopyInput(
  stopArea: EnrichedStopPlace,
  state: StopAreaVersionFormState,
): StopRegistryStopAreaCopyInput {
  const input = mapStopPlaceToInput(stopArea);

  // Set new validity dates to the keyvalues
  const keyValues = patchKeyValues(
    stopArea,
    compact([
      {
        key: 'validityStart',
        values: [state.validityStart],
      },
      state.validityEnd
        ? {
            key: 'validityEnd',
            values: [state.validityEnd],
          }
        : undefined,
    ]),
  ).filter((kv) => (kv?.key !== 'validityEnd' ? true : !state.indefinite));

  const allQuays = input.quays ?? [];
  const onlyQuaysValidDuringPeriod = allQuays.filter((quay) =>
    isObjectValidDuringPeriod(quay, state.validityStart, state.validityEnd),
  );

  const filteredQuays = compact(onlyQuaysValidDuringPeriod).map((quay) =>
    setInputQuayValidityDates(quay, state.validityStart, state.validityEnd),
  );

  return {
    ...omit(input, 'id'),
    keyValues,
    versionComment: state.versionName,
    quays: filteredQuays.length > 0 ? filteredQuays : undefined,
  };
}

function addDaysToISODate(date: string, addDays: number): string {
  return DateTime.fromISO(date).plus({ days: addDays }).toISODate();
}

type CutDatesSuccessResult = {
  readonly cutStart: string;
  readonly cutEnd?: string;
  readonly cutDirection: CutDirection;
};

type CutDatesRequiresConfirmationResult = {
  readonly showCutConfirmationModal: true;
  readonly cutDirection: CutDirection;
};

// Resolves current stop area validity cut dates and performs validation
export function determineCutDatesForCurrentStopArea(
  stopArea: EnrichedStopPlace,
  state: StopAreaVersionFormState,
  cutConfirmationGiven: boolean = false,
): CutDatesSuccessResult | CutDatesRequiresConfirmationResult {
  if (!stopArea.validityStart) {
    // Should not be possible
    throw new Error('Cannot copy stop area without validity start date.');
  }

  // If state start is earlier than current start, use state end date as start date
  if (state.validityStart <= stopArea.validityStart) {
    // Stop area is being cut from the beginning
    // - New start date will be the state end date + 1
    // - New end date will the current end date

    if (!state.validityEnd) {
      throw new CopyStopAreaInvalidDateRangeError(
        'Cannot create a copy of stop area that would have earlier start date than current version and no end date.',
      );
    }

    // State end date must be before current end date (if set)
    if (!!stopArea.validityEnd && state.validityEnd >= stopArea.validityEnd) {
      throw new CopyStopAreaInvalidDateRangeError(
        'Cannot create a copy of stop area that would leave the current version completely under it.',
      );
    }

    if (cutConfirmationGiven) {
      return {
        cutStart: addDaysToISODate(state.validityEnd, 1),
        cutEnd: stopArea.validityEnd,
        cutDirection: 'start',
      };
    }

    return {
      showCutConfirmationModal: true,
      cutDirection: 'start',
    };
  }

  // The copied version starts after the current version has ended.
  // Set end to one day before the new start date as it will cut any possible quays
  // that are set to be valid even after the stop area end date
  if (!!stopArea.validityEnd && state.validityStart > stopArea.validityEnd) {
    return {
      cutStart: stopArea.validityStart,
      cutEnd: addDaysToISODate(state.validityStart, -1),
      cutDirection: 'end',
    };
  }

  // Othwerwise, start day will stay the same and end date will be
  // the earlier of stop area end date and state end date
  let newEndDate: string | undefined;

  if (!cutConfirmationGiven) {
    return {
      showCutConfirmationModal: true,
      cutDirection: 'end',
    };
  }

  if (!stopArea.validityEnd) {
    newEndDate = addDaysToISODate(state.validityStart, -1);
  } else {
    const minDate =
      state.validityStart < stopArea.validityEnd
        ? state.validityStart
        : stopArea.validityEnd;
    newEndDate = addDaysToISODate(minDate, -1);
  }

  return {
    cutStart: stopArea.validityStart,
    cutEnd: newEndDate,
    cutDirection: 'end',
  };
}
