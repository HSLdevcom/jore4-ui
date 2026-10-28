import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useGetTodaysNameForStopPlaceQuery } from '../../../../../generated/graphql';
import { today as getToday } from '../../../../../utils/time';
import { TodaysName } from '../Types';
import { getNamesFromStopPlace } from '../Utils';

const GQL_GET_TODAYS_NAME_FOR_STOP_PLACE = gql`
  query GetTodaysNameForStopPlace($privateCode: String!, $today: String!) {
    stopsDb: stops_database {
      stopPlaces: stops_database_stop_place_newest_version(
        where: {
          private_code_value: { _eq: $privateCode }
          validity_start: { _lte: $today }
          _or: [
            { validity_end: { _gte: $today } }
            { validity_end: { _is_null: true } }
          ]
        }
        limit: 1
      ) {
        id
        name: name_value

        alternativeNames: stop_place_alternative_names {
          ...StopPlaceAlternativeNames
        }
      }
    }
  }
`;

export function useGetTodaysNameForStopPlace(privateCode: string) {
  const today = getToday().toString();
  const { data, ...rest } = useGetTodaysNameForStopPlaceQuery({
    variables: { privateCode, today },
  });

  const rawStopPlace = data?.stopsDb?.stopPlaces?.at(0);
  const todaysNameForStopPlace: TodaysName = useMemo(
    () => getNamesFromStopPlace(rawStopPlace),
    [rawStopPlace],
  );

  return { ...rest, todaysNameForStopPlace };
}
