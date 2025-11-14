import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  FindStopPlaceInfoFragment,
  useFindStopPlacesQuery,
} from '../../../../../generated/graphql';
import { mapToSqlLikeValue } from '../../../../../utils';
import { StopSearchFilters } from '../../types';
import { useNumericSortingCollator } from '../../utils';

export type FindStopPlaceInfo = FindStopPlaceInfoFragment;

const GQL_FIND_STOP_PLACE_INFO_FRAGMENT = gql`
  fragment FindStopPlaceInfo on stops_database_stop_place_newest_version {
    id
    netex_id
    version

    name_lang
    name_value

    private_code: private_code_value

    centroid
  }
`;

const GQL_FIND_STOP_PLACE = gql`
  query FindStopPlaces($query: String!, $validOn: String!, $isArea: Boolean!) {
    stops_database {
      stopPlaces: stops_database_stop_place_newest_version(
        where: {
          _and: [
            {
              _and: [
                { validity_start: { _lte: $validOn } }
                {
                  _or: [
                    { validity_end: { _gte: $validOn } }
                    { validity_end: { _is_null: true } }
                  ]
                }
              ]
            }
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
            { is_area: { _eq: $isArea } }
          ]
        }
        order_by: [{ netex_id: asc }, { version: desc }]
      ) {
        ...FindStopPlaceInfo
      }
    }
  }
`;

export function useFindStopPlaces(
  filters: StopSearchFilters,
  placeType: 'area' | 'terminal',
) {
  const labelSortCollator = useNumericSortingCollator();

  const { data, ...rest } = useFindStopPlacesQuery({
    variables: {
      query: mapToSqlLikeValue(filters.query),
      validOn: filters.observationDate.toString(),
      isArea: placeType === 'area',
    },
  });

  const rawStopPlaces = data?.stops_database?.stopPlaces;

  const stopPlaces: ReadonlyArray<FindStopPlaceInfo> = useMemo(() => {
    if (!rawStopPlaces) {
      return [];
    }

    return rawStopPlaces.toSorted(
      (a: FindStopPlaceInfo, b: FindStopPlaceInfo) =>
        labelSortCollator.compare(a.private_code ?? '', b.private_code ?? ''),
    );
  }, [rawStopPlaces, labelSortCollator]);

  return { ...rest, stopPlaces };
}
