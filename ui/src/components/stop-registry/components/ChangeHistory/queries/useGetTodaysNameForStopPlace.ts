import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useGetTodaysNameForStopPlaceQuery } from '../../../../../generated/graphql';
import { getNamesFromStopPlace } from '../../../stops/change-history/queries';
import { TodaysName } from '../../../stops/change-history/types';

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
  const today = DateTime.now().toISODate();
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
