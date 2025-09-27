import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import { useGetStopsByIdQuery } from '../../../../../generated/graphql';
import {
  StopSearchRow,
  mapQueryResultToStopSearchRow,
} from '../../../components';

const GQL_GET_STOPS_BY_ID = gql`
  query getStopsById($stopPlaceId: bigint) {
    stops_database {
      stops: stops_database_quay_newest_version(
        where: {
          _or: [
            { stop_place_id: { _eq: $stopPlaceId } }
            { stopPlaceParent: { stop_place_id: { _eq: $stopPlaceId } } }
          ]
        }
        order_by: [{ public_code: asc }]
      ) {
        ...stop_table_row_quay
      }
    }
  }
`;

export const useGetStopResultById = (stopPlaceId: number | bigint) => {
  const { data, ...rest } = useGetStopsByIdQuery({
    variables: { stopPlaceId },
  });

  const stopSearchRows: ReadonlyArray<StopSearchRow> = useMemo(() => {
    const mapped = data?.stops_database?.stops.map((quay) =>
      mapQueryResultToStopSearchRow(quay, quay.scheduled_stop_point_instance),
    );
    return compact(mapped);
  }, [data]);

  return {
    ...rest,
    stops: stopSearchRows,
  };
};
