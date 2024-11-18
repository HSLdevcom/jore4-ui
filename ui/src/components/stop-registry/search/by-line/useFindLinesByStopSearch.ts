import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  FindStopByLineInfoFragment,
  FindStopByLineRouteInfoFragment,
  useFindLinesByStopSearchQuery,
} from '../../../../generated/graphql';
import { mapToSqlLikeValue } from '../../../../utils';
import { StopSearchFilters } from '../types';
import { useNumericSortingCollator } from '../utils';

export type FindStopByLineInfo = FindStopByLineInfoFragment;
export type FindStopByLineRouteInfo = FindStopByLineRouteInfoFragment;

const GQL_FIND_LINES_BY_STOP_SEARCH_QUERY = gql`
  query findLinesByStopSearch($query: String!, $validOn: date!) {
    route_line(
      where: {
        label: { _ilike: $query }
        validity_start: { _lte: $validOn }
        _or: [
          { validity_end: { _gte: $validOn } }
          { validity_end: { _is_null: true } }
        ]
      }
      # We have a custom UI side sorting later on.
      # But we need to sort the items on backend side too,
      # so that we can use distinct_on
      order_by: [{ label: asc }, { priority: desc }]
      distinct_on: [label, priority]
    ) {
      ...FindStopByLineInfo
    }
  }

  fragment FindStopByLineInfo on route_line {
    line_id

    label
    name_i18n

    validity_start
    validity_end

    line_routes(
      where: {
        validity_start: { _lte: $validOn }
        _or: [
          { validity_end: { _gte: $validOn } }
          { validity_end: { _is_null: true } }
        ]
      }
      order_by: [{ direction: desc }, { priority: desc }]
      distinct_on: [direction, priority]
    ) {
      ...FindStopByLineRouteInfo
    }
  }

  fragment FindStopByLineRouteInfo on route_route {
    route_id

    label
    name_i18n

    direction

    priority
    validity_start
    validity_end
  }
`;

export function useFindLinesByStopSearch(filters: StopSearchFilters) {
  const labelSortCollator = useNumericSortingCollator();

  const { data, ...rest } = useFindLinesByStopSearchQuery({
    variables: {
      query: mapToSqlLikeValue(filters.query),
      validOn: filters.observationDate,
    },
    skip: filters.query.trim() === '',
  });

  const lines: ReadonlyArray<FindStopByLineInfo> = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.route_line.toSorted((a, b) =>
      labelSortCollator.compare(a.label, b.label),
    );
  }, [data, labelSortCollator]);

  return { ...rest, lines };
}
