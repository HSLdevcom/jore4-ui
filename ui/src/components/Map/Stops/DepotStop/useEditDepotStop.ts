import {
  ReusableComponentsVehicleModeEnum,
  useUpdateStopPointMutation,
} from '../../../../generated/graphql';
import { mapPointToGeoJSON } from '../../../../utils';
import { useGetStopLinkAndDirection } from '../utils';
import { DepotStopFormState } from './DepotStopFormSchema';

export function useEditDepotStop() {
  const getStopLinkAndDirection = useGetStopLinkAndDirection();
  const [updateStopPointMutation] = useUpdateStopPointMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['GetMapDepotStops'],
  });

  return async (depotStopId: string, state: DepotStopFormState) => {
    const measuredLocation = mapPointToGeoJSON(state);

    const { closestLink, direction } = await getStopLinkAndDirection({
      stopLocation: measuredLocation,
      vehicleMode: ReusableComponentsVehicleModeEnum.Tram,
    });

    await updateStopPointMutation({
      variables: {
        stopId: depotStopId,
        changes: {
          label: state.label,
          measured_location: measuredLocation,
          located_on_infrastructure_link_id: closestLink.infrastructure_link_id,
          direction,
        },
      },
    });
  };
}
