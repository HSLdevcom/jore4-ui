import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useGetTodaysNameForQuayQuery } from '../../../../../generated/graphql';
import { Priority } from '../../../../../types/enums';
import {
  TodaysName,
  getNamesFromStopPlace,
} from '../../../components/ChangeHistory';

const GQL_GET_TODAYS_NAME_FOR_QUAY = gql`
  query GetTodaysNameForQuay(
    $publicCode: String!
    $priority: Int!
    $today: date!
  ) {
    stopsDb: stops_database {
      stop: stops_database_quay_newest_version(
        where: {
          public_code: { _eq: $publicCode }
          priority: { _eq: $priority }
          validity_start: { _lte: $today }
          _or: [
            { validity_end: { _gte: $today } }
            { validity_end: { _is_null: true } }
          ]
        }
        limit: 1
      ) {
        netex_id

        stopPlace: stop_place {
          id
          name: name_value

          alternativeNames: stop_place_alternative_names {
            ...StopPlaceAlternativeNames
          }
        }
      }
    }
  }
`;

export function useGetTodaysNameForQuay(
  publicCode: string,
  priority: Priority,
) {
  const today = useMemo(() => DateTime.now().startOf('day'), []);
  const { data, ...rest } = useGetTodaysNameForQuayQuery({
    variables: { publicCode, today, priority },
  });

  const rawStopPlace = data?.stopsDb?.stop?.at(0)?.stopPlace;
  const todaysNameForQuay: TodaysName = useMemo(
    () => getNamesFromStopPlace(rawStopPlace),
    [rawStopPlace],
  );

  return { ...rest, todaysNameForQuay };
}
