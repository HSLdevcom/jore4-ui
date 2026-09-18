import { gql } from '@apollo/client';
import {
  ReusableComponentsVehicleModeEnum,
  useEditDepotStopMutation,
} from '../../../../generated/graphql';
import { mapPointToGeoJSON } from '../../../../utils';
import { useGetStopLinkAndDirection } from '../utils';
import { DepotStopFormState } from './DepotStopFormSchema';

const GQL_EDIT_DEPOT_STOP = gql`
  mutation EditDepotStop(
    $depotStopId: uuid!
    $patch: service_pattern_scheduled_stop_point_set_input!
  ) {
    update_service_pattern_scheduled_stop_point_by_pk(
      pk_columns: { scheduled_stop_point_id: $depotStopId }
      _set: $patch
    ) {
      scheduled_stop_point_id
    }
  }
`;

export function useEditDepotStop() {
  const getStopLinkAndDirection = useGetStopLinkAndDirection();
  const [editDepotStopMutation] = useEditDepotStopMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['GetMapDepotStops'],
  });

  return async (depotStopId: string, state: DepotStopFormState) => {
    const measuredLocation = mapPointToGeoJSON({
      latitude: state.latitude,
      longitude: state.longitude,
    });

    const { closestLink, direction } = await getStopLinkAndDirection({
      stopLocation: measuredLocation,
      vehicleMode: ReusableComponentsVehicleModeEnum.Tram,
    });

    await editDepotStopMutation({
      variables: {
        depotStopId,
        patch: {
          label: state.label,
          measured_location: measuredLocation,
          located_on_infrastructure_link_id: closestLink.infrastructure_link_id,
          direction,
        },
      },
    });
  };
}
