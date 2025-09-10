import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useGetQuayMaxPrivateCodeLazyQuery } from '../../../../generated/graphql';

const MIN_JORE_4_CODE = 7000000;
const MAX_JORE_4_CODE = 7999999;

const GQL_GET_QUAY_MAX_PRIVATE_CODE = gql`
  query GetQuayMaxPrivateCode {
    stops_database {
      stops_database_quay_aggregate(
        where: { private_code_value: { _like: "7______" } }
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

export function useGetNextQuayPrivateCode() {
  const [getQuayMaxPrivateCodeLazyQuery] = useGetQuayMaxPrivateCodeLazyQuery();

  return useCallback(async () => {
    const { data } = await getQuayMaxPrivateCodeLazyQuery();

    const rawMaxCode =
      data?.stops_database?.stops_database_quay_aggregate.aggregate?.max
        ?.private_code_value;
    const nextCode = Math.max(MIN_JORE_4_CODE, Number(rawMaxCode) + 1);

    if (nextCode > MAX_JORE_4_CODE) {
      throw new Error('Out of IDs for Quays!');
    }

    return nextCode.toString(10);
  }, [getQuayMaxPrivateCodeLazyQuery]);
}
