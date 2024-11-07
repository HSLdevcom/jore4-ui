import { gql } from '@apollo/client';
import { useMemo } from 'react';
import { useGetStopsByStopAreaIdQuery } from '../../../../generated/graphql';
import { StopSearchRow } from '../types';
import { mapQueryResultToStopSearchRows } from '../utils';

const GQL_GET_STOPS_BY_STOP_AREA_ID = gql`
  query getStopsByStopAreaId($stopAreaId: bigint!) {
    stops_database {
      stops: stops_database_stop_place_newest_version(
        where: {
          group_of_stop_places_members: {
            group_of_stop_places_id: { _eq: $stopAreaId }
          }
        }
      ) {
        ...stop_table_row_stop_place
      }
    }
  }
`;

export const useGetStopResultByStopAreaId = (stopAreaId: number | bigint) => {
  const { data, ...rest } = useGetStopsByStopAreaIdQuery({
    variables: { stopAreaId },
  });

  const stopSearchRows: ReadonlyArray<StopSearchRow> = useMemo(() => {
    if (!data?.stops_database?.stops) {
      return [];
    }

    return mapQueryResultToStopSearchRows(data.stops_database.stops);
  }, [data]);

  return {
    ...rest,
    stops: stopSearchRows,
  };
};
