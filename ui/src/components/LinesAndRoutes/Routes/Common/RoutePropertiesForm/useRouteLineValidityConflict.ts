import { useMemo } from 'react';
import {
  LineForComboboxFragment,
  useGetSelectedLineDetailsByIdQuery,
} from '../../../../../generated/graphql';
import { parseDate } from '../../../../../time';
import { mapDateInputToValidityEnd } from '../../../../../utils';
import { RouteFormState } from '../../../Common/RoutePropertiesForm.types';
import { getRouteLineValidityViolation } from '../../../Common/useValidateRouteMetadata';

type RouteLineValidityConflictParams = Partial<
  Pick<
    RouteFormState,
    'onLineId' | 'validityStart' | 'validityEnd' | 'indefinite'
  >
>;

type RouteLineValidityConflictResult = {
  readonly hasConflict: boolean;
  readonly line?: LineForComboboxFragment;
};

/**
 * Live check whether the route's validity period fits inside the selected line's
 * validity period, so the user can be warned before saving.
 */
export function useRouteLineValidityConflict({
  onLineId,
  validityStart,
  validityEnd,
  indefinite,
}: RouteLineValidityConflictParams): RouteLineValidityConflictResult {
  const { data } = useGetSelectedLineDetailsByIdQuery({
    skip: !onLineId,
    variables: { line_id: onLineId ?? '' },
  });

  const line = data?.route_line_by_pk ?? undefined;

  return useMemo(() => {
    const routeValidityStart = parseDate(validityStart);

    // Missing start date is handled by the required field validation, not here.
    if (!line || !routeValidityStart) {
      return { hasConflict: false, line };
    }

    // An empty end date without the indefinite flag is an incomplete input;
    // let the form validation report it instead of throwing here.
    if (!indefinite && !validityEnd) {
      return { hasConflict: false, line };
    }

    const routeValidityEnd = mapDateInputToValidityEnd(validityEnd, indefinite);

    const violation = getRouteLineValidityViolation(
      { validity_start: routeValidityStart, validity_end: routeValidityEnd },
      { validity_start: line.validity_start, validity_end: line.validity_end },
    );

    return { hasConflict: violation !== null, line };
  }, [line, validityStart, validityEnd, indefinite]);
}
