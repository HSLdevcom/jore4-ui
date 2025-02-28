import { gql } from '@apollo/client';
import omit from 'lodash/omit';
import { useMemo } from 'react';
import {
  GetStopByRouteIdSearchResultFragment,
  GetStopsByRouteIdQuery,
  useGetStopsByRouteIdQuery,
} from '../../../../generated/graphql';
import { SortOrder } from '../../../../types';
import { StopPlaceSearchRowDetails, StopSearchRow } from '../types';

const GQL_GET_STOPS_BY_ROUTE_ID_QUERY = gql`
  query getStopsByRouteId($routeId: uuid!) {
    stopPoints: service_pattern_scheduled_stop_point(
      where: {
        scheduled_stop_point_in_journey_patterns: {
          journey_pattern: { on_route_id: { _eq: $routeId } }
        }
      }
    ) {
      ...GetStopByRouteIdSearchResult
    }
  }

  fragment GetStopByRouteIdSearchResult on service_pattern_scheduled_stop_point {
    ...stop_table_row

    quay: newest_quay {
      ...stop_table_row_quay_base_details
    }

    journeyPatterns: scheduled_stop_point_in_journey_patterns(
      where: { journey_pattern: { on_route_id: { _eq: $routeId } } }
    ) {
      journey_pattern_id
      sequence: scheduled_stop_point_sequence
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

function mapRawStopPointToStopResults(
  stopPoint: GetStopByRouteIdSearchResultFragment,
): StopSearchRow {
  return {
    ...omit(stopPoint, ['quay']),
    quay: mapQuay(stopPoint),
  };
}

function compareSequenceNumbers(
  a: GetStopByRouteIdSearchResultFragment,
  b: GetStopByRouteIdSearchResultFragment,
): number {
  const aSequenceNumber = a.journeyPatterns?.at(0)?.sequence ?? -1;
  const bSequenceNumber = b.journeyPatterns?.at(0)?.sequence ?? -1;

  return aSequenceNumber - bSequenceNumber;
}

export function useGetStopResultsByRouteId(
  routeId: UUID,
  sortOrder: SortOrder,
) {
  const { data, ...rest } = useGetStopsByRouteIdQuery({
    variables: { routeId },
  });

  const stopPoints = data?.stopPoints;
  const stops: ReadonlyArray<StopSearchRow> = useMemo(() => {
    if (!stopPoints) {
      return [];
    }

    return stopPoints
      .toSorted(
        sortOrder === SortOrder.ASCENDING
          ? (a, b) => compareSequenceNumbers(a, b)
          : (a, b) => -compareSequenceNumbers(a, b),
      )
      .map(mapRawStopPointToStopResults);
  }, [stopPoints, sortOrder]);

  return { ...rest, stops };
}
