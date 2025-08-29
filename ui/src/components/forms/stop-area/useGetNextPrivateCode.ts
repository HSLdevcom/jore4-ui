import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useGetStopPlaceMaxPrivateCodeLazyQuery } from '../../../generated/graphql';

type Params = {
  readonly min: number;
  readonly max: number;
  readonly isParent: boolean;
  readonly mask: string;
};

const stopAreaParams: Params = {
  min: 700000,
  max: 799999,
  isParent: false,
  mask: '7_____',
};

const terminalParams: Params = {
  min: 7000000,
  max: 7999999,
  isParent: true,
  mask: '7______',
};

const GQL_GET_STOP_PLACE_MAX_PRIVATE_CODE = gql`
  query GetStopPlaceMaxPrivateCode($isParent: Boolean!, $mask: String!) {
    stops_database {
      stops_database_stop_place_aggregate(
        where: {
          parent_stop_place: { _eq: $isParent }
          private_code_value: { _like: $mask }
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

export function useGetNextPrivateCode(forTerminal = false) {
  const [getStopPlaceMaxPrivateCodeLazyQuery] =
    useGetStopPlaceMaxPrivateCodeLazyQuery();

  const params = forTerminal ? terminalParams : stopAreaParams;

  return useCallback(async () => {
    const { min, max, isParent, mask } = params;
    const { data } = await getStopPlaceMaxPrivateCodeLazyQuery({
      variables: { isParent, mask },
    });

    const rawMaxCode =
      data?.stops_database?.stops_database_stop_place_aggregate.aggregate?.max
        ?.private_code_value;
    const nextCode = Math.max(min, Number(rawMaxCode) + 1);

    if (nextCode > max) {
      throw new Error('Out of IDs for Stop Areas!');
    }

    return nextCode.toString(10);
  }, [getStopPlaceMaxPrivateCodeLazyQuery, params]);
}
