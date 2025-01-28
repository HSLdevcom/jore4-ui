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

      stopPlace: newest_stop_place {
        id
        netex_id

        name_lang
        name_value

        stop_place_alternative_names: quay_alternative_names {
          alternative_name {
            name_lang
            name_value
            name_type
          }
        }

        description_lang
        description_value
      }
    }
  }
`;

type RawStopPoint = GetStopsByRouteIdQuery['stopPoints'][number];

function mapStopPlace(rawStopPoint: RawStopPoint): StopPlaceSearchRowDetails {
  const rawStopPlace = rawStopPoint.stopPlace;

  if (!rawStopPlace) {
    return {
      netexId: null,
      nameFin: null,
      nameSwe: null,
    };
  }

  return {
    netexId: rawStopPlace.netex_id,
    nameFin: rawStopPlace.name_value,
    nameSwe: rawStopPlace.stop_place_alternative_names.find(
      (alternativeName) =>
        alternativeName.alternative_name.name_lang === 'swe' &&
        alternativeName.alternative_name.name_type === 'TRANSLATION',
    )?.alternative_name.name_value,
  };
}

function mapDataToStopResults(
  data: GetStopsByRouteIdQuery,
): Array<StopSearchRow> {
  return data.stopPoints.map((rawStopPoint) => {
    return {
      ...omit(rawStopPoint, ['stopPlace']),
      stop_place: mapStopPlace(rawStopPoint),
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
