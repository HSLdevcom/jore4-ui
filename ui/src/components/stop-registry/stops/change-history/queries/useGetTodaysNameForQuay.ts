import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useGetTodaysNameForQuayQuery } from '../../../../../generated/graphql';
import { Priority } from '../../../../../types/enums';
import { TodaysNameForQuay } from '../types';

const GQL_GET_TODAYS_NAME_FOR_QUAY = gql`
  query GetTodaysNameForQuay(
    $publicCode: String!
    $priority: String!
    $today: String!
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
            stop_place_id
            alternative_names_id
            alternativeName: alternative_name {
              id
              name_value
              name_lang
              name_type
            }
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
  const today = DateTime.now().toISODate();
  const { data, ...rest } = useGetTodaysNameForQuayQuery({
    variables: { publicCode, today, priority: priority.toString() },
  });

  const rawStopPlace = data?.stopsDb?.stop?.at(0)?.stopPlace;
  const todaysNameForQuay: TodaysNameForQuay = useMemo(() => {
    const name = rawStopPlace?.name ?? null;
    const nameSwe =
      rawStopPlace?.alternativeNames
        .map((it) => it.alternativeName)
        .find((it) => it.name_lang === 'swe' && it.name_type === 'TRANSLATION')
        ?.name_value ?? null;

    return { name, nameSwe };
  }, [rawStopPlace]);

  return { ...rest, todaysNameForQuay };
}
