import { gql } from '@apollo/client';
import { useDeleteDepotStopMutation } from '../../../../../generated/graphql';

const GQL_DELETE_DEPOT_STOP = gql`
  mutation DeleteDepotStop($depotStopId: uuid!) {
    delete_service_pattern_scheduled_stop_point_by_pk(
      scheduled_stop_point_id: $depotStopId
    ) {
      scheduled_stop_point_id
    }
  }
`;

export function useDeleteDepotStop() {
  const [deleteDepotStopMutation] = useDeleteDepotStopMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['GetMapDepotStops'],
  });

  return async (depotStopId: string) => {
    await deleteDepotStopMutation({ variables: { depotStopId } });
  };
}
