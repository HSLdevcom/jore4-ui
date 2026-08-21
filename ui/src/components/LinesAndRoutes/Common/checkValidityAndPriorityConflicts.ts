import { gql, useApolloClient } from '@apollo/client';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import {
  DateComparisonExp,
  GetLinesByValidityDocument,
  GetLinesByValidityQuery,
  GetLinesByValidityQueryVariables,
  GetRoutesByValidityDocument,
  GetRoutesByValidityQuery,
  GetRoutesByValidityQueryVariables,
  GetStopsByValidityDocument,
  GetStopsByValidityQuery,
  GetStopsByValidityQueryVariables,
  InputMaybe,
  IntComparisonExp,
  RouteDirectionEnum,
  RouteLineBoolExp,
  RouteRouteBoolExp,
  ServicePatternScheduledStopPointBoolExp,
  TimetablesRouteDirectionEnum,
} from '../../../generated/graphql';
import { Priority } from '../../../types/enums';

const GQL_GET_LINES_BY_VALIDITY = gql`
  query GetLinesByValidity($filter: route_line_bool_exp) {
    route_line(where: $filter) {
      ...LineAllFields
    }
  }
`;

const GQL_GET_ROUTES_BY_VALIDITY = gql`
  query GetRoutesByValidity($filter: route_route_bool_exp) {
    route_route(where: $filter) {
      ...RouteDefaultFields
    }
  }
`;

const GQL_GET_STOPS_BY_VALIDITY = gql`
  query GetStopsByValidity(
    $filter: service_pattern_scheduled_stop_point_bool_exp
  ) {
    service_pattern_scheduled_stop_point(where: $filter) {
      ...ScheduledStopPointAllFields
    }
  }
`;

type ItemWithValidityBoolExp = {
  readonly _and?: InputMaybe<ReadonlyArray<ItemWithValidityBoolExp>>;
  readonly _not?: InputMaybe<ItemWithValidityBoolExp>;
  readonly _or?: InputMaybe<ReadonlyArray<ItemWithValidityBoolExp>>;

  readonly priority?: InputMaybe<IntComparisonExp>;
  readonly validity_end?: InputMaybe<DateComparisonExp>;
  readonly validity_start?: InputMaybe<DateComparisonExp>;
};

export type CommonParams = {
  readonly label: string;
  readonly priority: Priority;
  readonly validityStart?: DateTime;
  readonly validityEnd?: DateTime;
};

type RouteParams = CommonParams & {
  readonly direction: RouteDirectionEnum;
  readonly variant: number | null;
};

function buildValidityStartMissingGqlFilterOrConditions(
  params: CommonParams,
): ItemWithValidityBoolExp {
  const { validityEnd } = params;

  return {
    _or: [
      // this and existing have undefined validity_start
      // existing: ----?
      // new: ----|
      { validity_start: { _is_null: true } },

      // existing resource starts before this ends
      // existing: |----?
      // new:     ---|
      { validity_start: { _lte: validityEnd } },
    ],
  };
}

function buildValidityEndMissingGqlFilterOrConditions(
  params: CommonParams,
): ItemWithValidityBoolExp {
  const { validityStart } = params;

  return {
    _or: [
      // this and exsisting have undefined validity_end
      // existing: ?----
      // new: |-----
      { validity_end: { _is_null: true } },
      // existing resource ends after this starts
      // existing: ?----|
      // new:         |-------
      { validity_end: { _gte: validityStart } },
    ],
  };
}

function buildValidityBoundedGqlFilterOrConditions(
  params: CommonParams,
): ItemWithValidityBoolExp {
  const { validityStart, validityEnd } = params;

  return {
    _or: [
      // existing resource is valid during this resource
      // existing: |---|
      // new:     |-----|
      {
        _and: [
          { validity_start: { _gte: validityStart } },
          { validity_end: { _lte: validityEnd } },
        ],
      },
      // existing resource started before and ended after
      // existing: |--------|
      // new:        |--|
      {
        _and: [
          { validity_start: { _lte: validityStart } },
          { validity_end: { _gte: validityEnd } },
        ],
      },
      // existing resource start indefinite, ends during
      // existing: ---|
      // new:    |--------|
      {
        _and: [
          { validity_start: { _is_null: true } },
          { validity_end: { _gte: validityStart } },
        ],
      },
      // existing indefinite resource starts before this ends
      // existing: |------
      // new: |------|
      {
        _and: [
          { validity_start: { _lte: validityEnd } },
          { validity_end: { _is_null: true } },
        ],
      },
      // indefinite validity without start or end
      // existing: -------
      // new:       |--|
      {
        _and: [
          { validity_start: { _is_null: true } },
          { validity_end: { _is_null: true } },
        ],
      },
      // existing resource ends after this starts
      // existing: |------|
      // new:         |-----|
      {
        _and: [
          { validity_start: { _lte: validityStart } },
          { validity_end: { _gte: validityStart } },
        ],
      },
      // existing resource starts before this ends and ends after this ended
      // existing: |------|
      // new:  |-----|
      {
        _and: [
          { validity_start: { _lte: validityEnd } },
          { validity_end: { _gte: validityEnd } },
        ],
      },
    ],
  };
}

function buildCommonGqlFilterOrConditions(
  params: CommonParams,
): ItemWithValidityBoolExp {
  const { validityStart, validityEnd } = params;

  if (!validityStart && !validityEnd) {
    return {};
  }

  if (!validityStart) {
    return buildValidityStartMissingGqlFilterOrConditions(params);
  }

  if (!validityEnd) {
    return buildValidityEndMissingGqlFilterOrConditions(params);
  }

  return buildValidityBoundedGqlFilterOrConditions(params);
}

function buildCommonGqlFilter(params: CommonParams) {
  const { label, priority } = params;

  return {
    label: { _eq: label },
    priority: { _eq: priority },
    ...buildCommonGqlFilterOrConditions(params),
  };
}

/** Builds an object for gql to filter by variant */
export function buildVariantGqlFilter(
  variant?: number | null,
): RouteRouteBoolExp {
  if (variant === null) {
    return { variant: { _is_null: true } };
  }

  return { variant: { _eq: variant } };
}

export function useGetConflictingLines() {
  const apollo = useApolloClient();

  return useCallback(
    async (params: CommonParams, lineId?: UUID) => {
      const isDraft = params.priority === Priority.Draft;
      if (isDraft) {
        // Resources marked as "draft" are allowed to overlap
        // with priority and validity time
        return [];
      }

      // Ignore row itself as if we are editing existing version of row then
      // possible conflict doesn't matter as we are *overwriting* conflicting
      // version.
      const lineFilter: RouteLineBoolExp = lineId
        ? { _not: { line_id: { _eq: lineId } } }
        : {};
      const commonFilter: RouteLineBoolExp = buildCommonGqlFilter(params);

      const { data } = await apollo.query<
        GetLinesByValidityQuery,
        GetLinesByValidityQueryVariables
      >({
        query: GetLinesByValidityDocument,
        variables: { filter: { ...lineFilter, ...commonFilter } },
      });

      return data.route_line;
    },
    [apollo],
  );
}

export function useGetConflictingRoutes() {
  const apollo = useApolloClient();

  return useCallback(
    async (params: RouteParams, routeId?: UUID) => {
      const isDraft = params.priority === Priority.Draft;
      if (isDraft) {
        // Resources marked as "draft" are allowed to have conflicts
        // with priority and validity time
        return [];
      }

      // Allow routes with different direction to exists with same validity period.
      // That way both directions of same route can exist.
      const directionFilter: RouteRouteBoolExp = {
        // Hasura generates 2 versions of the RouteDirection enum.
        // Both are identical, but TS does not consider identical enums compatible.
        // Which enum gets chosen for this field has changed in Hasura between
        // versions 2.33 & 2.44. Cast to correct type.
        direction: {
          _eq: params.direction as unknown as TimetablesRouteDirectionEnum,
        },
      };

      // Allow routes with different variant to exists with same validity period.
      const variantFilter: RouteRouteBoolExp = buildVariantGqlFilter(
        params.variant,
      );

      // Ignore row itself as if we are editing existing version of row then
      // possible conflict doesn't matter as we are *overwriting* conflicting
      // version.
      const routesFilter: RouteRouteBoolExp = routeId
        ? { _not: { route_id: { _eq: routeId } } }
        : {};
      const commonFilter: RouteRouteBoolExp = buildCommonGqlFilter(params);

      const { data } = await apollo.query<
        GetRoutesByValidityQuery,
        GetRoutesByValidityQueryVariables
      >({
        query: GetRoutesByValidityDocument,
        variables: {
          filter: {
            ...directionFilter,
            ...variantFilter,
            ...routesFilter,
            ...commonFilter,
          },
        },
      });

      return data.route_route;
    },
    [apollo],
  );
}

export function useGetConflictingStops() {
  const apollo = useApolloClient();

  return useCallback(
    async (params: CommonParams, stopId?: UUID) => {
      const isDraft = params.priority === Priority.Draft;
      if (isDraft) {
        // Resources marked as "draft" are allowed to overlap
        // with priority and validity time
        return [];
      }

      // Ignore row itself as if we are editing existing version of row then
      // possible conflict doesn't matter as we are *overwriting* conflicting
      // version.
      const stopsFilter: ServicePatternScheduledStopPointBoolExp = stopId
        ? { _not: { scheduled_stop_point_id: { _eq: stopId } } }
        : {};
      const commonFilter: ServicePatternScheduledStopPointBoolExp =
        // Stops do not necessarily have validity start defined
        // (e.g. if they have been imported from jore3)
        buildCommonGqlFilter(params);

      const { data } = await apollo.query<
        GetStopsByValidityQuery,
        GetStopsByValidityQueryVariables
      >({
        query: GetStopsByValidityDocument,
        variables: { filter: { ...stopsFilter, ...commonFilter } },
      });

      return data.service_pattern_scheduled_stop_point;
    },
    [apollo],
  );
}
