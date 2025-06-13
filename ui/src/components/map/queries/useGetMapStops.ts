import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  MapStopMinimalDetailsFragment,
  StopsDatabaseQuayNewestVersionBoolExp,
  useGetMapStopsQuery,
} from '../../../generated/graphql';
import { useMapDataLayerSimpleQueryLoader } from '../../../hooks';
import { Operation } from '../../../redux';
import { Viewport } from '../../../redux/types';
import { parseDate } from '../../../time';
import { Priority } from '../../../types/enums';
import { mapCompactOrNull } from '../../stop-registry/utils';
import { MapStop } from '../types';

const GQL_GET_MAP_STOPS = gql`
  query GetMapStops($where: stops_database_quay_newest_version_bool_exp) {
    stops_database {
      stops: stops_database_quay_newest_version(where: $where) {
        ...MapStopMinimalDetails
      }
    }
  }

  fragment MapStopMinimalDetails on stops_database_quay_newest_version {
    id
    netex_id
    label: public_code
    validity_start
    validity_end
    priority
    centroid
    stop_place_netex_id
  }
`;

function viewportToWhere(
  viewport: Viewport,
): StopsDatabaseQuayNewestVersionBoolExp {
  const [[west, south], [east, north]] = viewport.bounds;

  return {
    centroid: {
      _st_within: {
        type: 'Polygon',
        coordinates: [
          [
            [west, south],
            [east, south],
            [east, north],
            [west, north],
            [west, south],
          ],
        ],
      },
    },
  };
}

function whereSelectedTerminal(
  terminalId: string | null | undefined,
): StopsDatabaseQuayNewestVersionBoolExp | null {
  if (!terminalId) {
    return null;
  }

  return { stopPlaceParent: { parent: { netex_id: { _eq: terminalId } } } };
}

function whereSelectedStopArea(
  stopAreaId: string | null | undefined,
): StopsDatabaseQuayNewestVersionBoolExp | null {
  if (!stopAreaId) {
    return null;
  }

  return { stop_place_netex_id: { _eq: stopAreaId } };
}

function mapRawStopToMapStop(
  rawStop: MapStopMinimalDetailsFragment | null,
): MapStop | null {
  if (
    !rawStop?.label ||
    rawStop.centroid?.type !== 'Point' ||
    !rawStop.netex_id ||
    !rawStop.stop_place_netex_id
  ) {
    return null;
  }

  return {
    label: rawStop.label,
    location: rawStop.centroid,
    netex_id: rawStop.netex_id,
    stop_place_netex_id: rawStop.stop_place_netex_id,
    priority: Number(rawStop.priority) as Priority,
    validity_start: parseDate(rawStop.validity_start),
    validity_end: parseDate(rawStop.validity_end),
  };
}

type GetMapStopsOptions = {
  readonly selectedStopAreaId: string | null | undefined;
  readonly selectedTerminalId: string | null | undefined;
  readonly skipFetching: boolean;
  readonly viewport: Viewport;
};

export function useGetMapStops({
  selectedStopAreaId,
  selectedTerminalId,
  skipFetching,
  viewport,
}: GetMapStopsOptions) {
  const stopsResult = useGetMapStopsQuery({
    variables: {
      where: {
        _or: compact([
          viewportToWhere(viewport),
          whereSelectedStopArea(selectedStopAreaId),
          whereSelectedTerminal(selectedTerminalId),
        ]),
      },
    },
    skip: skipFetching,
  });

  const setFetchStopsLoadingState = useMapDataLayerSimpleQueryLoader(
    Operation.FetchStops,
    stopsResult,
    skipFetching,
  );

  const { data, previousData, loading, ...rest } = stopsResult;

  const rawStops = loading
    ? previousData?.stops_database?.stops
    : data?.stops_database?.stops;

  const stops: ReadonlyArray<MapStop> = useMemo(
    () => mapCompactOrNull(rawStops, mapRawStopToMapStop) ?? [],
    [rawStops],
  );

  return { ...rest, loading, stops, setFetchStopsLoadingState };
}
