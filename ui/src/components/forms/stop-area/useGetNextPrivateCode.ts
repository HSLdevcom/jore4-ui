import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useGetStopPlaceMaxPrivateCodeLazyQuery } from '../../../generated/graphql';

const MIN_JORE_4_CODE = 700000;
const MAX_JORE_4_CODE = 799999;

const GQL_GET_STOP_PLACE_MAX_PRIVATE_CODE = gql`
  query GetStopPlaceMaxPrivateCode {
    stops_database {
      stops_database_stop_place_aggregate(
        where: {
          parent_stop_place: { _eq: false }
          private_code_value: { _like: "7_____" }
        }
      ) {
        aggregate {
          max {
            private_code_value
          }
        }
      }
    }
  }
`;

export function useGetNextPrivateCode() {
  const [getStopPlaceMaxPrivateCodeLazyQuery] =
    useGetStopPlaceMaxPrivateCodeLazyQuery();

  return useCallback(async () => {
    const { data } = await getStopPlaceMaxPrivateCodeLazyQuery();

    const rawMaxCode =
      data?.stops_database?.stops_database_stop_place_aggregate.aggregate?.max
        ?.private_code_value;
    const nextCode = Math.max(MIN_JORE_4_CODE, Number(rawMaxCode) + 1);

    if (nextCode > MAX_JORE_4_CODE) {
      throw new Error('Out of IDs for Stop Areas!');
    }

    return nextCode.toString(10);
  }, [getStopPlaceMaxPrivateCodeLazyQuery]);
}
