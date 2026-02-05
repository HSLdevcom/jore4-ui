import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { useGetTodaysNameForQuayQuery } from '../../../../../generated/graphql';

const GQL_GET_TODAYS_NAME_FOR_QUAY = gql`
  query GetTodaysNameForQuay($publicCode: String!, $today: String!) {
    stopsDb: stops_database {
      stop: stops_database_quay_newest_version(
        where: {
          public_code: { _eq: $publicCode }
          validity_start: { _lte: $today }
          _or: [
            { validity_end: { _gte: $today } }
            { validity_end: { _is_null: true } }
          ]
        }
        order_by: [{ priority: desc }]
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

type TodaysNameForQuay = {
  readonly name: string | null;
  readonly nameSwe: string | null;
};

export function useGetTodaysNameForQuay(publicCode: string) {
  const today = DateTime.now().toISODate();
  const { data, ...rest } = useGetTodaysNameForQuayQuery({
    variables: { publicCode, today },
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
