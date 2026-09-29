import { gql } from '@apollo/client';
import { useMemo } from 'react';
import {
  MapMinimalDepotStopDetailsFragment,
  useGetMapDepotStopsQuery,
} from '../../../generated/graphql';
import { Operation, Viewport } from '../../../redux';
import { mapCompactOrNull, requireValue } from '../../../utils';
import { MapDepotStop } from '../Types';
import { buildWithinViewportGqlGeographyFilter } from '../Utils/buildWithinViewportGqlGeometryFilter';
import { useMapDataLayerSimpleQueryLoader } from '../Utils/useMapDataLayerLoader';

const GQL_GET_MAP_DEPOT_STOPS = gql`
  query GetMapDepotStops($locationFilter: geography_comparison_exp) {
    service_pattern_scheduled_stop_point(
      where: {
        point_type: { _eq: garage_point }
        measured_location: $locationFilter
      }
    ) {
      ...MapMinimalDepotStopDetails
    }
  }

  fragment MapMinimalDepotStopDetails on service_pattern_scheduled_stop_point {
    scheduled_stop_point_id
    label
    measured_location
    validity_start
    validity_end
    timing_place_id
  }
`;

function mapRawDepotStopToMapDepotStop(
  raw: MapMinimalDepotStopDetailsFragment,
): MapDepotStop | null {
  if (raw.measured_location.type !== 'Point') {
    return null;
  }

  return {
    id: raw.scheduled_stop_point_id,
    label: raw.label,
    location: raw.measured_location,
    validityStart: requireValue(raw.validity_start).toISODate(),
    validityEnd: raw.validity_end?.toISODate() ?? undefined,
    timingPlaceId: raw.timing_place_id,
  };
}

type GetMapDepotStopsOptions = {
  readonly skipFetching: boolean;
  readonly viewport: Viewport;
};

export function useGetMapDepotStops({
  skipFetching,
  viewport,
}: GetMapDepotStopsOptions) {
  const result = useGetMapDepotStopsQuery({
    variables: {
      locationFilter: buildWithinViewportGqlGeographyFilter(viewport),
    },
    skip: skipFetching,
  });
  useMapDataLayerSimpleQueryLoader(
    Operation.FetchDepotStops,
    result,
    skipFetching,
  );

  const { data, previousData, loading, ...rest } = result;

  const rawDepotStops = loading
    ? previousData?.service_pattern_scheduled_stop_point
    : data?.service_pattern_scheduled_stop_point;

  const depotStops: ReadonlyArray<MapDepotStop> = useMemo(
    () => mapCompactOrNull(rawDepotStops, mapRawDepotStopToMapDepotStop) ?? [],
    [rawDepotStops],
  );

  return { ...rest, loading, depotStops };
}
