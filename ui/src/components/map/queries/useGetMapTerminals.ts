import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  MapMinimalTerminalDetailsFragment,
  useGetStopTerminalsByLocationQuery,
} from '../../../generated/graphql';
import { useMapDataLayerSimpleQueryLoader } from '../../../hooks';
import { Operation } from '../../../redux';
import { Viewport } from '../../../redux/types';
import { buildWithinViewportGqlGeometryFilter } from '../../../utils';
import { ChildStopPlaceIds, MapTerminal } from '../types';

const GQL_QUERY_GET_STOP_TERMINALS_BY_LOCATION = gql`
  query GetStopTerminalsByLocation($locationFilter: geometry_comparison_exp) {
    stops_database {
      terminals: stops_database_stop_place_newest_version(
        where: {
          centroid: $locationFilter
          netex_id: { _is_null: false }
          parent_stop_place: { _eq: true }
        }
      ) {
        ...MapMinimalTerminalDetails
      }
    }
  }

  fragment MapMinimalTerminalDetails on stops_database_stop_place_newest_version {
    id
    netex_id
    private_code_value
    centroid
    name_value

    children {
      children_id
      stop_place_id
      child {
        id
        netexId: netex_id
      }
    }
  }
`;

function mapRawTerminalToMapTerminal(
  raw: MapMinimalTerminalDetailsFragment,
): MapTerminal {
  return {
    ...raw,
    children: raw.children
      .map((child) => child.child)
      .filter((it): it is ChildStopPlaceIds => typeof it.netexId === 'string'),
  };
}

type GetMapTerminalsOptions = {
  readonly skipFetching: boolean;
  readonly viewport: Viewport;
};

export function useGetMapTerminals({
  skipFetching,
  viewport,
}: GetMapTerminalsOptions) {
  const result = useGetStopTerminalsByLocationQuery({
    variables: {
      locationFilter: buildWithinViewportGqlGeometryFilter(viewport),
    },
    skip: skipFetching,
  });
  useMapDataLayerSimpleQueryLoader(
    Operation.FetchTerminals,
    result,
    skipFetching,
  );

  const data = result.loading ? result.previousData : result.data;
  const rawTerminals = data?.stops_database?.terminals;
  const terminals = useMemo(() => {
    if (!rawTerminals) {
      return [];
    }

    return rawTerminals.map(mapRawTerminalToMapTerminal);
  }, [rawTerminals]);

  return { ...result, terminals };
}
