import { DateTime } from 'luxon';
import {
  RouteDirectionEnum,
  RouteLineBoolExp,
  RouteRouteBoolExp,
  ServicePatternScheduledStopPointBoolExp,
  TimetablesRouteDirectionEnum,
  useGetLinesByValidityLazyQuery,
  useGetRoutesByValidityLazyQuery,
  useGetStopsByValidityLazyQuery,
} from '../../../generated/graphql';
import { Priority } from '../../../types/enums';
import { buildVariantGqlFilter } from '../../../utils';

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

const buildValidityStartMissingGqlFilterOrConditions = (
  params: CommonParams,
) => {
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
};

const buildValidityEndMissingGqlFilterOrConditions = (params: CommonParams) => {
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
};

const buildValidityBoundedGqlFilterOrConditions = (params: CommonParams) => {
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
};

const buildCommonGqlFilterOrConditions = (params: CommonParams) => {
  const { validityStart, validityEnd } = params;
  if (!validityStart && !validityEnd) {
    return [];
  }
  if (!validityStart) {
    return buildValidityStartMissingGqlFilterOrConditions(params);
  }
  if (!validityEnd) {
    return buildValidityEndMissingGqlFilterOrConditions(params);
  }
  return buildValidityBoundedGqlFilterOrConditions(params);
};

const buildCommonGqlFilter = (params: CommonParams) => {
  const { label, priority } = params;

  return {
    label: { _eq: label },
    priority: { _eq: priority },
    ...buildCommonGqlFilterOrConditions(params),
  };
};

export const useCheckValidityAndPriorityConflicts = () => {
  const [getLineValidity] = useGetLinesByValidityLazyQuery();
  const [getStopValidity] = useGetStopsByValidityLazyQuery();
  const [getRouteValidity] = useGetRoutesByValidityLazyQuery();

  const getConflictingLines = async (params: CommonParams, lineId?: UUID) => {
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

    const { data } = await getLineValidity({
      variables: { filter: { ...lineFilter, ...commonFilter } },
    });

    return data?.route_line ?? [];
  };

  const getConflictingStops = async (params: CommonParams, stopId?: UUID) => {
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

    const { data } = await getStopValidity({
      variables: {
        filter: { ...stopsFilter, ...commonFilter },
      },
    });

    return data?.service_pattern_scheduled_stop_point;
  };

  const getConflictingRoutes = async (params: RouteParams, routeId?: UUID) => {
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

    const { data } = await getRouteValidity({
      variables: {
        filter: {
          ...directionFilter,
          ...variantFilter,
          ...routesFilter,
          ...commonFilter,
        },
      },
    });

    return data?.route_route ?? [];
  };

  return {
    getConflictingLines,
    getConflictingStops,
    getConflictingRoutes,
  };
};
