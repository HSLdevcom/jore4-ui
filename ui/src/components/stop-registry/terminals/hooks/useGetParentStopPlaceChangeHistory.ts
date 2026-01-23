import { gql } from '@apollo/client';
import {
  StopsDatabaseStopPlaceBoolExp,
  useGetLatestParentStopPlaceChangeQuery,
  useGetParentStopPlaceChangeHistoryQuery,
} from '../../../../generated/graphql';

const GQL_GET_PARENT_STOP_PLACE_CHANGE_HISTORY = gql`
  query GetParentStopPlaceChangeHistory(
    $where: stops_database_stop_place_bool_exp!
  ) {
    stopsDb: stops_database {
      stopPlace: stops_database_stop_place(
        where: $where
        order_by: { version: desc }
      ) {
        changed
        changed_by
        private_code_value
        version
        version_comment
      }
    }
  }
`;

const GQL_GET_LATEST_PARENT_STOP_PLACE_CHANGE = gql`
  query GetLatestParentStopPlaceChange(
    $where: stops_database_stop_place_bool_exp!
  ) {
    stopsDb: stops_database {
      stopPlace: stops_database_stop_place(
        where: $where
        order_by: { version: desc }
        limit: 1
      ) {
        changed
        changed_by
        private_code_value
      }
    }
  }
`;

export function useGetParentStopPlaceChangeHistory(
  where: StopsDatabaseStopPlaceBoolExp,
) {
  const { data, ...rest } = useGetParentStopPlaceChangeHistoryQuery({
    variables: { where },
  });

  const parentStopPlaceVersions = data?.stopsDb?.stopPlace ?? [];

  return {
    ...rest,
    parentStopPlaceVersions,
  };
}

export function useGetLatestParentStopPlaceChange(
  where: StopsDatabaseStopPlaceBoolExp,
) {
  const { data, ...rest } = useGetLatestParentStopPlaceChangeQuery({
    variables: { where },
  });

  const latestParentStopPlace = data?.stopsDb?.stopPlace?.[0];

  const latestParentStopPlaceChangeData = {
    changed: latestParentStopPlace?.changed ?? null,
    changedBy: latestParentStopPlace?.changed_by ?? null,
    privateCode: latestParentStopPlace?.private_code_value ?? null,
  };

  return { ...rest, latestParentStopPlaceChangeData };
}
