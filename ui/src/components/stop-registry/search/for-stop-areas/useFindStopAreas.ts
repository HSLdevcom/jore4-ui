import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  FindStopAreaInfoFragment,
  useFindStopAreasQuery,
} from '../../../../generated/graphql';
import { mapToSqlLikeValue } from '../../../../utils';
import { StopSearchFilters } from '../types';
import { useNumericSortingCollator } from '../utils';

export type FindStopAreaInfo = FindStopAreaInfoFragment;

const GQL_FIND_STOP_AREAS = gql`
  query findStopAreas($query: String!, $validOn: timestamp!) {
    stops_database {
      stops_database_group_of_stop_places(
        where: {
          _and: [
            {
              _or: [
                { description_value: { _ilike: $query } }
                { name_value: { _ilike: $query } }
                { short_name_value: { _ilike: $query } }
                {
                  group_of_stop_places_alternative_names: {
                    alternative_name: { name_value: { _ilike: $query } }
                  }
                }
              ]
            }
            { from_date: { _lte: $validOn } }
            {
              _or: [
                { to_date: { _gte: $validOn } }
                { to_date: { _is_null: true } }
              ]
            }
          ]
        }
        order_by: [{ netex_id: asc }, { version: desc }]
      ) {
        ...FindStopAreaInfo
      }
    }
  }

  fragment FindStopAreaInfo on stops_database_group_of_stop_places {
    id
    netex_id
    version

    from_date
    to_date

    name_lang
    name_value

    description_lang
    description_value

    centroid
  }
`;

export function useFindStopAreas(filters: StopSearchFilters) {
  const labelSortCollator = useNumericSortingCollator();

  const { data, ...rest } = useFindStopAreasQuery({
    variables: {
      query: mapToSqlLikeValue(filters.query),
      validOn: filters.observationDate,
    },
  });

  const stopAreas: ReadonlyArray<FindStopAreaInfo> = useMemo(
    () =>
      (
        data?.stops_database?.stops_database_group_of_stop_places ?? []
      ).toSorted((a, b) =>
        labelSortCollator.compare(a.name_value ?? '', b.name_value ?? ''),
      ),
    [data, labelSortCollator],
  );

  return { ...rest, stopAreas };
}
