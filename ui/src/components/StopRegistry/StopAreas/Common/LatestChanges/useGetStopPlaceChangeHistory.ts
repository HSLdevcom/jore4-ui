import { gql } from '@apollo/client';
import {
  StopsDatabaseStopPlaceBoolExp,
  useGetLatestStopPlaceChangeQuery,
} from '../../../../../generated/graphql';

const GQL_GET_LATEST_STOP_PLACE_CHANGE = gql`
  query GetLatestStopPlaceChange($where: stops_database_stop_place_bool_exp!) {
    stopsDb: stops_database {
      stopPlace: stops_database_stop_place(
        where: $where
        order_by: { changed: desc }
        limit: 1
      ) {
        changed
        changed_by
        private_code_value
        netex_id
      }
    }
  }
`;

export function useGetLatestStopPlaceChange(
  where: StopsDatabaseStopPlaceBoolExp,
) {
  const { data, ...rest } = useGetLatestStopPlaceChangeQuery({
    variables: { where },
  });

  const latestStopPlace = data?.stopsDb?.stopPlace?.[0];

  const latestStopPlaceChangeData = {
    changed: latestStopPlace?.changed ?? null,
    changedBy: latestStopPlace?.changed_by ?? null,
  };

  return { ...rest, latestStopPlaceChangeData };
}
