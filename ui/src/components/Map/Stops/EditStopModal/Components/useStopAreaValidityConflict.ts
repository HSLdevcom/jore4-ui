import { useMemo } from 'react';
import { parseDate } from '../../../../../time';
import { getValidityContainmentViolation } from '../../../../../utils';
import { mapDateInputToValidityEnd } from '../../../../common/Forms';
import {
  StopFormState,
  StopModalStopAreaFormSchema,
} from '../../../../StopRegistry/Stops/Common/StopForm';

type StopAreaValidityConflictParams = Partial<
  Pick<StopFormState, 'validityStart' | 'validityEnd' | 'indefinite'>
> & {
  // Validity of the selected stop area, already present in the stop form state
  // so no extra query is needed to run this check.
  readonly stopArea?: StopModalStopAreaFormSchema | null;
};

type StopAreaValidityConflictResult = {
  readonly hasConflict: boolean;
};

/**
 * Live check whether the stop's validity period fits inside the selected stop
 * area's validity period, so the user can be warned before saving.
 */
export function useStopAreaValidityConflict({
  stopArea,
  validityStart,
  validityEnd,
  indefinite,
}: StopAreaValidityConflictParams): StopAreaValidityConflictResult {
  return useMemo(() => {
    const stopValidityStart = parseDate(validityStart);

    // Missing start date is handled by the required field validation, not here.
    if (!stopArea || !stopValidityStart) {
      return { hasConflict: false };
    }

    // An empty end date without the indefinite flag is an incomplete input;
    // let the form validation report it instead of throwing here.
    if (!indefinite && !validityEnd) {
      return { hasConflict: false };
    }

    const stopValidityEnd = mapDateInputToValidityEnd(validityEnd, indefinite);

    const violation = getValidityContainmentViolation(
      { validity_start: stopValidityStart, validity_end: stopValidityEnd },
      {
        validity_start: parseDate(stopArea.validityStart),
        validity_end: stopArea.validityEnd
          ? parseDate(stopArea.validityEnd)
          : null,
      },
    );

    return { hasConflict: violation !== null };
  }, [stopArea, validityStart, validityEnd, indefinite]);
}
