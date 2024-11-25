import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useFindExistingPosterNamesQuery } from '../../../../../../generated/graphql';

const GQL_GET_POSTER_LABELS = gql`
  query findExistingPosterNames {
    stops_database {
      stops_database_info_spot_poster(
        order_by: [{ label: asc }]
        distinct_on: [label]
      ) {
        id
        label
      }
    }
  }
`;

export const usePosterNames = () => {
  const { data } = useFindExistingPosterNamesQuery();

  return useMemo(
    () => data?.stops_database?.stops_database_info_spot_poster ?? [],
    [data],
  );
};
