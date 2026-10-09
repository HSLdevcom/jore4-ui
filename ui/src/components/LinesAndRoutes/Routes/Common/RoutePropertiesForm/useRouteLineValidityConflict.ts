import { useMemo } from 'react';
import { LineForComboboxFragment } from '../../../../../generated/graphql';
import { parseDate } from '../../../../../time';
import { mapDateInputToValidityEnd } from '../../../../../utils';
import { RouteFormState } from '../../../Common/RoutePropertiesForm.types';
import { getRouteLineValidityViolation } from '../../../Common/useValidateRouteMetadata';

type RouteLineValidityConflictParams = Partial<
  Pick<RouteFormState, 'validityStart' | 'validityEnd' | 'indefinite'>
> & {
  // Validity of the selected line, lifted from the line dropdown so no extra
  // query is needed just to run this check.
  readonly line?: LineForComboboxFragment | null;
};

type RouteLineValidityConflictResult = {
  readonly hasConflict: boolean;
};

/**
 * Live check whether the route's validity period fits inside the selected line's
 * validity period, so the user can be warned before saving.
 */
export function useRouteLineValidityConflict({
  line,
  validityStart,
  validityEnd,
  indefinite,
}: RouteLineValidityConflictParams): RouteLineValidityConflictResult {
  return useMemo(() => {
    const routeValidityStart = parseDate(validityStart);

    // Missing start date is handled by the required field validation, not here.
    if (!line || !routeValidityStart) {
      return { hasConflict: false };
    }

    // An empty end date without the indefinite flag is an incomplete input;
    // let the form validation report it instead of throwing here.
    if (!indefinite && !validityEnd) {
      return { hasConflict: false };
    }

    const routeValidityEnd = mapDateInputToValidityEnd(validityEnd, indefinite);

    const violation = getRouteLineValidityViolation(
      { validity_start: routeValidityStart, validity_end: routeValidityEnd },
      { validity_start: line.validity_start, validity_end: line.validity_end },
    );

    return { hasConflict: violation !== null };
  }, [line, validityStart, validityEnd, indefinite]);
}
