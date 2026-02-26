import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  QuayChangeHistoryItem,
  useGetLatestStopChangeHistoryQuery,
} from '../../../../../generated/graphql';
import { Priority } from '../../../../../types/enums';

const GQL_GET_LATEST_STOP_CHANGE_HISTORY = gql`
  query GetLatestStopChangeHistory($publicCode: String!, $limit: Int!) {
    stopsDb: stops_database {
      historyItems: getQuayChangeHistory(
        where: { publicCode: { _eq: $publicCode } }
        order_by: [{ changed: desc }, { version: desc }]
        limit: $limit
      ) {
        ...QuayChangeHistoryItemDetails
      }
    }
  }
`;

type GetLatestStopChangeHistoryOptions = {
  readonly publicCode: string;
  readonly limit?: number;
};

export function useGetLatestStopChangeHistoryItems({
  publicCode,
  limit = 6,
}: GetLatestStopChangeHistoryOptions) {
  const { data, ...rest } = useGetLatestStopChangeHistoryQuery({
    variables: {
      publicCode,
      limit,
    },
  });

  const { historyItems: rawHistoryItems } = data?.stopsDb ?? {};
  const historyItems: ReadonlyArray<QuayChangeHistoryItem> = useMemo(
    () =>
      compact(rawHistoryItems).map((item) => ({
        ...item,
        versionComment: item.versionComment?.trim(),
      })),
    [rawHistoryItems],
  );

  return { ...rest, historyItems };
}
