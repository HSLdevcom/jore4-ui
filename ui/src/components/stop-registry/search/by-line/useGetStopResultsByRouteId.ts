import { gql } from '@apollo/client';
import omit from 'lodash/omit';
import { useMemo } from 'react';
import {
  GetStopsByRouteIdQuery,
  useGetStopsByRouteIdQuery,
} from '../../../../generated/graphql';
import { StopPlaceSearchRowDetails, StopSearchRow } from '../types';

const GQL_GET_STOPS_BY_ROUTE_ID_QUERY = gql`
  query getStopsByRouteId($routeId: uuid!) {
    stopPoints: service_pattern_scheduled_stop_point(
      where: {
        scheduled_stop_point_in_journey_patterns: {
          journey_pattern: { on_route_id: { _eq: $routeId } }
        }
      }
      order_by: [{ label: asc }]
    ) {
      ...stop_table_row

      quay: newest_quay {
        ...stop_table_row_quay_base_details
      }
    }
  }
`;

type RawStopPoint = GetStopsByRouteIdQuery['stopPoints'][number];

function mapQuay(rawStopPoint: RawStopPoint): StopPlaceSearchRowDetails {
  const rawQuay = rawStopPoint.quay;

  if (!rawQuay) {
    return {
      netexId: null,
      nameFin: null,
      nameSwe: null,
    };
  }

  return {
    netexId: rawQuay.netex_id,
    nameFin: rawQuay.stop_place?.name_value,
    nameSwe: rawQuay.stop_place?.stop_place_alternative_names.find(
      (alternativeName) =>
        alternativeName.alternative_name.name_lang === 'swe' &&
        alternativeName.alternative_name.name_type === 'TRANSLATION',
    )?.alternative_name.name_value,
  };
}

function mapDataToStopResults(
  data: GetStopsByRouteIdQuery,
): Array<StopSearchRow> {
  return data.stopPoints.map((rawQuay) => {
    return {
      ...omit(rawQuay, ['quay']),
      quay: mapQuay(rawQuay),
    };
  });
}

export function useGetStopResultsByRouteId(routeId: UUID) {
  const { data, ...rest } = useGetStopsByRouteIdQuery({
    variables: { routeId },
  });

  const stops = useMemo(() => {
    if (!data) {
      return [];
    }

    return mapDataToStopResults(data);
  }, [data]);

  return { ...rest, stops };
}
