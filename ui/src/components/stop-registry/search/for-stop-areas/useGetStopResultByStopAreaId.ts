import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useGetStopsByStopAreaIdQuery } from '../../../../generated/graphql';
import { StopSearchRow } from '../types';
import { mapQueryResultToStopSearchRows } from '../utils';

const GQL_GET_STOPS_BY_STOP_AREA_ID = gql`
  query getStopsByStopAreaId($stopAreaId: bigint!) {
    stops_database {
      quays: stops_database_quay_newest_version(
        where: { stop_place_id: { _eq: $stopAreaId } }
        order_by: [{ public_code: asc }]
      ) {
        ...stop_table_row_quay
      }
    }
  }
`;

export const useGetStopResultByStopAreaId = (stopAreaId: number | bigint) => {
  const { data, ...rest } = useGetStopsByStopAreaIdQuery({
    variables: { stopAreaId },
  });

  const stopSearchRows: ReadonlyArray<StopSearchRow> = useMemo(() => {
    if (!data?.stops_database?.quays) {
      return [];
    }

    return mapQueryResultToStopSearchRows(data.stops_database.quays);
  }, [data]);

  return {
    ...rest,
    stops: stopSearchRows,
  };
};
