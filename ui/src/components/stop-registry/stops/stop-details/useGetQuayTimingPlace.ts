import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useGetQuayTimingPlaceQuery } from '../../../../generated/graphql';

const GQL_GET_QUAY_TIMING_PLACE = gql`
  query GetQuayTimingPlace($publicCode: String!) {
    stops_database {
      stops_database_quay_newest_version(
        where: { public_code: { _eq: $publicCode } }
      ) {
        netex_id
        public_code
        timing_place {
          timing_place_id
          label
        }
      }
    }
  }
`;

export function useGetQuayTimingPlace(publicCode: string) {
  const { data, ...rest } = useGetQuayTimingPlaceQuery({
    variables: { publicCode },
    skip: !publicCode,
  });

  const timingPlaceData = useMemo(() => {
    const timingPlace =
      data?.stops_database?.stops_database_quay_newest_version?.[0]
        ?.timing_place;

    return timingPlace
      ? {
          timingPlaceId: timingPlace.timing_place_id,
          timingPlaceLabel: timingPlace.label,
        }
      : null;
  }, [data]);

  return { timingPlaceData, ...rest };
}
