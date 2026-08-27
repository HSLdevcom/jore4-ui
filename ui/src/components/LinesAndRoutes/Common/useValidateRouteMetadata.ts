import { gql, useApolloClient } from '@apollo/client';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetLineValidityByIdDocument,
  GetLineValidityByIdQuery,
  GetLineValidityByIdQueryVariables,
} from '../../../generated/graphql';
import { parseDate } from '../../../time';
import { mapDateInputToValidityEnd } from '../../../utils';
import { RouteFormState } from '../../forms/route/RoutePropertiesForm.types';

const GQL_GET_LINE_VALIDITY_BY_ID = gql`
  query GetLineValidityById($lineId: uuid!) {
    line: route_line_by_pk(line_id: $lineId) {
      ...LineValidity
    }
  }

  fragment LineValidity on route_line {
    line_id
    validity_start
    validity_end
  }
`;

type ValidityPeriodParams = {
  readonly validity_start?: DateTime | null;
  readonly validity_end?: DateTime | null;
};

// TODOO: Replace with custom errors and translate them at catch site.
export function assertRouteValidityIsInsideLineValidity(
  t: TFunction,
  route: ValidityPeriodParams,
  line: ValidityPeriodParams,
) {
  if (
    !route.validity_start ||
    (line.validity_start && route.validity_start < line.validity_start)
  ) {
    throw new Error(t(($) => $.routes.startNotInsideLineValidity));
  }

  if (
    line.validity_end &&
    (!route.validity_end || route.validity_end > line.validity_end)
  ) {
    throw new Error(t(($) => $.routes.endNotInsideLineValidity));
  }
}

export function assertRouteValidityStartIsBeforeEnd(
  t: TFunction,
  route: ValidityPeriodParams,
) {
  if (
    route.validity_start &&
    route.validity_end &&
    route.validity_start > route.validity_end
  ) {
    throw new Error(t(($) => $.routes.validityStartIsAfterEnd));
  }
}

function assertRouteMetadataIsValid(
  t: TFunction,
  routeMetadata: RouteFormState,
  line: ValidityPeriodParams,
) {
  const routeValidityStart = parseDate(routeMetadata.validityStart);
  const routeValidityEnd = mapDateInputToValidityEnd(
    routeMetadata.validityEnd,
    routeMetadata.indefinite,
  );

  assertRouteValidityIsInsideLineValidity(
    t,
    { validity_start: routeValidityStart, validity_end: routeValidityEnd },
    line,
  );

  assertRouteValidityStartIsBeforeEnd(t, {
    validity_start: routeValidityStart,
    validity_end: routeValidityEnd,
  });
}

export function useValidateRouteMetadata() {
  const { t } = useTranslation();
  const apollo = useApolloClient();

  // Check route's validity period is inside line's validity period
  return useCallback(
    async (routeMetadata: RouteFormState) => {
      const {
        data: { line },
      } = await apollo.query<
        GetLineValidityByIdQuery,
        GetLineValidityByIdQueryVariables
      >({
        query: GetLineValidityByIdDocument,
        variables: { lineId: routeMetadata.onLineId },
      });

      // This should never happen
      if (!line) {
        throw new Error(
          `Specified line ${routeMetadata.onLineId} not found from the Database!`,
        );
      }

      assertRouteMetadataIsValid(t, routeMetadata, line);
    },
    [t, apollo],
  );
}
