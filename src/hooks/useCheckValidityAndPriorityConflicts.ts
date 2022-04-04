import { DateTime } from 'luxon';
import {
  RouteLine,
  RouteLineBoolExp,
  ServicePatternScheduledStopPoint,
  ServicePatternScheduledStopPointBoolExp,
  useGetLinesByValidityAsyncQuery,
  useGetStopsByValidityAsyncQuery,
} from '../generated/graphql';
import { Priority } from '../types/Priority';

interface CommonParams {
  label: string;
  priority: Priority;
  validityStart?: DateTime;
  validityEnd?: DateTime;
}

const buildValidityStartMissingGqlFilterOrConditions = (
  params: CommonParams,
) => {
  const { validityEnd } = params;

  return [
    // indefinite validity without start or end
    {
      _and: [
        { validity_start: { _is_null: true } },
        { validity_end: { _is_null: true } },
      ],
    },
    // valid from the beginning of the times until given time
    {
      _and: [
        { validity_start: { _is_null: true } },
        { validity_end: { _gte: validityEnd } },
      ],
    },
  ];
};

const buildCommonGqlFilter = (
  params: CommonParams,
  allowUndefinedValidityStart?: boolean,
) => {
  const { label, priority, validityStart, validityEnd } = params;

  const isIndefinite = !validityEnd;

  const validityStartFilterCondition = allowUndefinedValidityStart
    ? buildValidityStartMissingGqlFilterOrConditions(params)
    : [];

  const validityFilter = isIndefinite
    ? // case 1: this resource in indefinite
      {
        _or: [
          // existing resource ends after this starts
          { validity_end: { _gte: validityStart } },
          // there is existing indefinite resource
          { validity_end: { _is_null: true } },
          ...validityStartFilterCondition,
        ],
      }
    : {
        _or: [
          // case 2: this resource has ending date

          // existing indefinite resource starts before this ends
          {
            _and: [
              { validity_start: { _lte: validityEnd } },
              { validity_end: { _is_null: true } },
            ],
          },
          // existing resource starts before this starts and ends after this has started
          {
            _and: [
              { validity_start: { _lte: validityStart } },
              { validity_end: { _gte: validityStart } },
            ],
          },
          // existing resource starts before this ends and ends after this ended
          {
            _and: [
              { validity_start: { _lte: validityEnd } },
              { validity_end: { _gte: validityEnd } },
            ],
          },
          // existing resource is valid during this resource
          {
            _and: [
              { validity_start: { _gte: validityStart } },
              { validity_end: { _lte: validityEnd } },
            ],
          },
          ...validityStartFilterCondition,
        ],
      };
  return {
    label: { _eq: label },
    priority: { _eq: priority },
    ...validityFilter,
  };
};

export const useCheckValidityAndPriorityConflicts = () => {
  const [getLineValidity] = useGetLinesByValidityAsyncQuery();
  const [getStopValidity] = useGetStopsByValidityAsyncQuery();

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
      filter: { ...lineFilter, ...commonFilter },
    });

    // We have to cast return type from GetLinesByValidityQuery['route_line'] -> RouteLine[]
    // to be able to use simpler type later on. Both should be the same.
    return data.route_line as RouteLine[];
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
      buildCommonGqlFilter(params, true);
    const filter = {
      ...stopsFilter,
      ...commonFilter,
    };

    const { data } = await getStopValidity({
      filter,
    });

    // We have to cast return type from GetStopsByValidityQuery['service_pattern_scheduled_stop_point'] -> ServicePatternScheduledStopPoint[]
    // to be able to use simpler type later on. Both should be the same.
    return data.service_pattern_scheduled_stop_point as ServicePatternScheduledStopPoint[];
  };

  return {
    getConflictingLines,
    getConflictingStops,
  };
};
