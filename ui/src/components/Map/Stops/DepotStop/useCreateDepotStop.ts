import {
  ReusableComponentsVehicleModeEnum,
  ServicePatternPointTypeEnum,
  useInsertStopPointMutation,
} from '../../../../generated/graphql';
import { parseDate } from '../../../../time';
import { Priority } from '../../../../types/enums';
import {
  mapDateInputToValidityEnd,
  mapPointToGeoJSON,
} from '../../../../utils';
import { useGetStopLinkAndDirection } from '../utils';
import { DepotStopFormState } from './DepotStopFormSchema';

export function useCreateDepotStop() {
  const getStopLinkAndDirection = useGetStopLinkAndDirection();
  const [insertStopPointMutation] = useInsertStopPointMutation({
    awaitRefetchQueries: true,
    refetchQueries: ['GetMapDepotStops'],
  });

  return async (state: DepotStopFormState) => {
    const measuredLocation = mapPointToGeoJSON(state);

    const { closestLink, direction } = await getStopLinkAndDirection({
      stopLocation: measuredLocation,
      vehicleMode: ReusableComponentsVehicleModeEnum.Tram,
    });

    await insertStopPointMutation({
      variables: {
        stopPoint: {
          label: state.label,
          measured_location: measuredLocation,
          located_on_infrastructure_link_id: closestLink.infrastructure_link_id,
          direction,
          priority: Priority.Standard,
          validity_start: parseDate(state.validityStart),
          validity_end: mapDateInputToValidityEnd(
            state.validityEnd,
            state.indefinite,
          ),
          timing_place_id: state.timingPlaceId ?? null,
          point_type: ServicePatternPointTypeEnum.GaragePoint,
          vehicle_mode_on_scheduled_stop_point: {
            data: [{ vehicle_mode: ReusableComponentsVehicleModeEnum.Tram }],
          },
        },
      },
    });
  };
}
