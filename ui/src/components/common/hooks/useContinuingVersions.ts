import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import {
  RouteRouteBoolExp,
  TimetablesRouteDirectionEnum,
  useGetRouteContinuationCandidatesQuery,
} from '../../../generated/graphql';
import { Priority } from '../../../types/enums';
import {
  RouteVersionKey,
  VersionedEntity,
  hasContinuingVersion,
  isEndingSoon,
  isVersionOfSameRoute,
} from '../../../utils';

const GQL_GET_ROUTE_CONTINUATION_CANDIDATES = gql`
  query GetRouteContinuationCandidates($where: route_route_bool_exp!) {
    route_route(where: $where) {
      route_id
      label
      direction
      variant
      priority
      validity_start
      validity_end
    }
  }
`;

type RouteVersion = RouteVersionKey &
  VersionedEntity & { readonly validity_end?: DateTime | null };

function buildRouteContinuationFilter(route: RouteVersion): RouteRouteBoolExp {
  return {
    label: { _eq: route.label },
    direction: {
      _eq: route.direction as unknown as TimetablesRouteDirectionEnum,
    },
    // Hasura ignores `_eq: null`, so null variant must be matched explicitly.
    variant:
      route.variant === null || route.variant === undefined
        ? { _is_null: true }
        : { _eq: route.variant },
    priority: { _neq: Priority.Draft },
    _or: [
      { validity_end: { _gt: route.validity_end } },
      { validity_end: { _is_null: true } },
    ],
  };
}

/**
 * Returns a function telling whether the given route, ending soon, has another
 * version taking over when it ends.
 */
export function useRouteContinuations(routes: ReadonlyArray<RouteVersion>) {
  const endingSoon = routes.filter((route) => isEndingSoon(route.validity_end));

  const { data } = useGetRouteContinuationCandidatesQuery({
    variables: { where: { _or: endingSoon.map(buildRouteContinuationFilter) } },
    skip: !endingSoon.length,
  });
  const candidates = data?.route_route;

  return useCallback(
    (route: RouteVersion) =>
      hasContinuingVersion(
        route,
        (candidates ?? []).filter((other) =>
          isVersionOfSameRoute(route, other),
        ),
      ),
    [candidates],
  );
}
