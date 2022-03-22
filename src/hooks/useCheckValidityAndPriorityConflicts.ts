import { DateTime } from 'luxon';
import {
  GetLinesByValidityDocument,
  GetLinesByValidityQuery,
  GetLinesByValidityQueryVariables,
  RouteLine,
  RouteLineBoolExp,
} from '../generated/graphql';
import { Priority } from '../types/Priority';
import { useAsyncQuery } from './useAsyncQuery';

interface CommonParams {
  label: string;
  priority: Priority;
  validityStart: DateTime;
  validityEnd?: DateTime;
}

const buildCommonGqlFilter = (params: CommonParams) => {
  const { label, priority, validityStart, validityEnd } = params;

  const isIndefinite = !validityEnd;

  const validityFilter = isIndefinite
    ? // case 1: this resource in indefinite
      {
        _or: [
          // existing resource ends after this starts
          { validity_end: { _gte: validityStart } },
          // there is existing indefinite resource
          { validity_end: { _is_null: true } },
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
        ],
      };
  return {
    label: { _eq: label },
    priority: { _eq: priority },
    ...validityFilter,
  };
};

export const useCheckValidityAndPriorityConflicts = () => {
  const [getLineValidity] = useAsyncQuery<
    GetLinesByValidityQuery,
    GetLinesByValidityQueryVariables
  >(GetLinesByValidityDocument);

  const getConflictingLines = async (params: CommonParams, lineId?: UUID) => {
    const isDraft = params.priority === Priority.Draft;
    if (isDraft) {
      // Resources marked as "draft" are allowed to have conflicts
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

  return {
    getConflictingLines,
  };
};
