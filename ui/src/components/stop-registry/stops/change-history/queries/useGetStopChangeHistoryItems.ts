import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import {
  QuayChangeHistoryItem,
  StopsDatabaseQuayChangeHistoryItemOrderBy,
  useGetStopChangeHistoryQuery,
} from '../../../../../generated/graphql';

const GQL_GET_STOP_CHANGE_HISTORY = gql`
  query GetStopChangeHistory(
    $where: stops_database_QuayChangeHistoryItem_bool_exp_bool_exp
    $orderBy: [stops_database_QuayChangeHistoryItem_order_by!]!
  ) {
    stopsDb: stops_database {
      historyItems: getQuayChangeHistory(where: $where, order_by: $orderBy) {
        netexId
        version

        changed
        changedBy
        versionComment

        # Used to determine whether the stop was imported from JORE3 or created in JORE4.
        privateCodeType
        privateCodeValue
        publicCode

        validityStart
        validityEnd
        priority

        stopPlaceNetexId
        stopPlaceVersion
      }
    }
  }
`;

type GetStopChangeHistoryOptions = {
  readonly from: DateTime;
  readonly to: DateTime;
  readonly publicCode: string;
  readonly orderBy: ReadonlyArray<StopsDatabaseQuayChangeHistoryItemOrderBy>;
};

export function useGetStopChangeHistoryItems({
  from,
  to,
  publicCode,
  orderBy,
}: GetStopChangeHistoryOptions) {
  const fromStartOfDay = from.startOf('day').toISO();
  const toEndOfDay = to.endOf('day').toISO();

  const { data, ...rest } = useGetStopChangeHistoryQuery({
    variables: {
      where: {
        _and: [
          { publicCode: { _eq: publicCode } },
          { changed: { _gte: fromStartOfDay } },
          { changed: { _lte: toEndOfDay } },
        ],
      },
      orderBy,
    },
  });

  const rawHistoryItems = data?.stopsDb?.historyItems;
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
