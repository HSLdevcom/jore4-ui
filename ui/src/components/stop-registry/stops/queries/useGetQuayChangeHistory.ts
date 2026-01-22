import { gql } from '@apollo/client';
import {
  StopsDatabaseQuayBoolExp,
  useGetLatestQuayChangeQuery,
  useGetQuayChangeHistoryQuery,
} from '../../../../generated/graphql';

const GQL_GET_QUAY_CHANGE_HISTORY = gql`
  query GetQuayChangeHistory($where: stops_database_quay_bool_exp) {
    stopsDb: stops_database {
      quay: stops_database_quay(where: $where, order_by: { version: desc }) {
        changed
        changed_by
        public_code
        version
        version_comment
      }
    }
  }
`;

const GQL_GET_LATEST_QUAY_CHANGE = gql`
  query GetLatestQuayChange($where: stops_database_quay_bool_exp) {
    stopsDb: stops_database {
      quay: stops_database_quay(
        where: $where
        order_by: { version: desc }
        limit: 1
      ) {
        changed
        changed_by
        public_code
      }
    }
  }
`;

export const useGetQuayChangeHistory = (where: StopsDatabaseQuayBoolExp) => {
  const { data, ...rest } = useGetQuayChangeHistoryQuery({
    variables: { where },
  });

  const quayVersions = data?.stopsDb?.quay ?? [];

  return {
    ...rest,
    quayVersions,
  };
};

export const useGetLatestQuayChange = (where: StopsDatabaseQuayBoolExp) => {
  const { data, ...rest } = useGetLatestQuayChangeQuery({
    variables: { where },
  });

  const latestQuay = data?.stopsDb?.quay?.[0];

  const latestQuayChangeData = {
    changed: latestQuay?.changed ?? null,
    changedBy: latestQuay?.changed_by ?? null,
  };

  return {
    ...rest,
    latestQuayChangeData,
  };
};
