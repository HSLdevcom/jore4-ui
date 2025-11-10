import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useGetInfoSpotPurposesQuery } from '../../../../../../generated/graphql';
import { stringToInfoSpotPurposeEnum } from '../utils/infoSpotPurposeUtils';

const GQL_GET_INFO_SPOT_PURPOSES = gql`
  query GetInfoSpotPurposes {
    stopsDb: stops_database {
      latestInfoSpots: stops_database_info_spot(
        distinct_on: netex_id
        order_by: [{ netex_id: asc }, { version: desc }]
      ) {
        purpose
      }
    }
  }
`;

export function useGetInfoSpotPurposes() {
  const { data, loading } = useGetInfoSpotPurposesQuery();

  const customPurposes = useMemo(() => {
    if (!data || loading) {
      return [];
    }

    const purposes = new Set<string>();

    // Collect purposes from latest version of each info spot,
    // so that unused purposes are not included in the dropdown
    data.stopsDb?.latestInfoSpots?.forEach((item) => {
      if (item.purpose) {
        purposes.add(item.purpose);
      }
    });

    // Filter out purposes that match predefined enums
    return Array.from(purposes)
      .filter((purpose) => !stringToInfoSpotPurposeEnum(purpose))
      .sort();
  }, [data, loading]);

  return { customPurposes, loading };
}
