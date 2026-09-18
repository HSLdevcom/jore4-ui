import { gql } from '@apollo/client';
import {
  RouteUniqueFieldsFragment,
  useDeleteDepotStopMutation,
} from '../../../../../generated/graphql';
import { MapDepotStop } from '../../../Types';
import { useGetStopWithRoutes } from '../../utils';

const GQL_DELETE_DEPOT_STOP = gql`
  mutation DeleteDepotStop($depotStopId: uuid!) {
    delete_service_pattern_scheduled_stop_point_by_pk(
      scheduled_stop_point_id: $depotStopId
    ) {
      scheduled_stop_point_id
    }
  }
`;

export type DeleteDepotStopChanges = {
  readonly depotStop: MapDepotStop;
  readonly deleteStopFromRoutes: ReadonlyArray<RouteUniqueFieldsFragment>;
};

export function usePrepareDeleteDepotStop() {
  const getStopWithRoutes = useGetStopWithRoutes();

  return async (depotStop: MapDepotStop): Promise<DeleteDepotStopChanges> => {
    const { routes } = await getStopWithRoutes(depotStop.id);

    return { depotStop, deleteStopFromRoutes: routes };
  };
}

export function useDeleteDepotStop() {
  const [deleteDepotStopMutation] = useDeleteDepotStopMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['GetMapDepotStops'],
  });

  return async (depotStopId: string) => {
    await deleteDepotStopMutation({ variables: { depotStopId } });
  };
}
