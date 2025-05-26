import { gql } from '@apollo/client';
import { Point } from 'geojson';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  StopsDatabaseQuayNewestVersionBoolExp,
  useGetMapStopsQuery,
} from '../../../generated/graphql';
import { useMapDataLayerSimpleQueryLoader } from '../../../hooks';
import { Operation } from '../../../redux';
import { Viewport } from '../../../redux/types';
import { parseDate } from '../../../time';
import { FilterableStopInfo } from '../../../types';
import { Priority } from '../../../types/enums';

const GQL_GET_MAP_STOPS = gql`
  query GetMapStops($where: stops_database_quay_newest_version_bool_exp) {
    stops_database {
      stops: stops_database_quay_newest_version(where: $where) {
        id
        netex_id
        label: public_code
        validity_start
        validity_end
        priority
        centroid
        stop_place_netex_id
      }
    }
  }
`;

export type MapStop = FilterableStopInfo & {
  readonly location: Point;
  readonly netex_id: string;
  readonly stop_place_netex_id: string;
};

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

type GetMapStopsOptions = {
  readonly skipFetching: boolean;
  readonly viewport: Viewport;
};

export function useGetMapStops({ skipFetching, viewport }: GetMapStopsOptions) {
  const stopsResult = useGetMapStopsQuery({
    variables: {
      where: viewportToWhere(viewport),
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

  const stops: ReadonlyArray<MapStop> = useMemo(() => {
    if (!rawStops) {
      return [];
    }

    const mapped = rawStops.map((rawStop): MapStop | null => {
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
    });

    return compact(mapped);
  }, [rawStops]);

  return { ...rest, loading, stops, setFetchStopsLoadingState };
}
