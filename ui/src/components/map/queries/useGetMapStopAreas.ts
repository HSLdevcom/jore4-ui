import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import { useGetStopAreasByLocationQuery } from '../../../generated/graphql';
import { Operation } from '../../../redux';
import { Viewport } from '../../../redux/types';
import { buildWithinViewportGqlGeometryFilter } from '../../../utils';
import { useMapDataLayerSimpleQueryLoader } from '../../common/hooks';

const GQL_QUERY_GET_STOP_AREAS_BY_LOCATION = gql`
  query GetStopAreasByLocation($locationFilter: geometry_comparison_exp) {
    stops_database {
      areas: stops_database_stop_place_newest_version(
        where: {
          centroid: $locationFilter
          netex_id: { _is_null: false }
          parent_stop_place: { _eq: false }
        }
      ) {
        ...mapMinimalStopAreaDetails
      }
    }
  }

  fragment mapMinimalStopAreaDetails on stops_database_stop_place_newest_version {
    id
    netex_id
    private_code_value
    centroid
    name_value
  }
`;

type GetMapStopAreasOptions = {
  readonly skipFetching: boolean;
  readonly viewport: Viewport;
};

export function useGetMapStopAreas({
  skipFetching,
  viewport,
}: GetMapStopAreasOptions) {
  const result = useGetStopAreasByLocationQuery({
    variables: {
      locationFilter: buildWithinViewportGqlGeometryFilter(viewport),
    },
    skip: skipFetching,
  });
  useMapDataLayerSimpleQueryLoader(
    Operation.FetchStopAreas,
    result,
    skipFetching,
  );

  const data = result.loading ? result.previousData : result.data;
  const rawAreas = data?.stops_database?.areas;
  const areas = useMemo(() => compact(rawAreas), [rawAreas]);

  return { ...result, areas };
}
