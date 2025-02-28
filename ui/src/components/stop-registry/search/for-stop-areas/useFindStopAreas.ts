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
  query findStopAreas($query: String!, $validOn: String!) {
    stops_database {
      stopAreas: stops_database_stop_place_newest_version(
        where: {
          _and: [
            {
              _or: [
                { private_code_value: { _ilike: $query } }
                { name_value: { _ilike: $query } }
                {
                  stop_place_alternative_names: {
                    alternative_name: { name_value: { _ilike: $query } }
                  }
                }
              ]
            }
            { validity_start: { _lte: $validOn } }
            {
              _or: [
                { validity_end: { _gte: $validOn } }
                { validity_end: { _is_null: true } }
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

  fragment FindStopAreaInfo on stops_database_stop_place_newest_version {
    id
    netex_id
    version

    name_lang
    name_value

    private_code: private_code_value

    centroid
  }
`;

export function useFindStopAreas(filters: StopSearchFilters) {
  const labelSortCollator = useNumericSortingCollator();

  const { data, ...rest } = useFindStopAreasQuery({
    variables: {
      query: mapToSqlLikeValue(filters.query),
      validOn: filters.observationDate.toString(),
    },
  });

  const rawStopAreas = data?.stops_database?.stopAreas;
  const stopAreas: ReadonlyArray<FindStopAreaInfo> = useMemo(() => {
    if (!rawStopAreas) {
      return [];
    }

    return rawStopAreas.toSorted((a, b) =>
      labelSortCollator.compare(a.private_code ?? '', b.private_code ?? ''),
    );
  }, [rawStopAreas, labelSortCollator]);

  return { ...rest, stopAreas };
}
