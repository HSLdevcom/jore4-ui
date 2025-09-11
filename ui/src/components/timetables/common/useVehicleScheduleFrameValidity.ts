import { gql } from '@apollo/client';
import uniq from 'lodash/uniq';
import { DateTime } from 'luxon';
import {
  useGetVehicleScheduleFrameWithRoutesQuery,
  useUpdateVehicleScheduleFrameValidityMutation,
} from '../../../generated/graphql';

const GQL_VEHICLE_SCHEDULE_FRAME_WITH_ROUTES = gql`
  fragment vehicle_schedule_frame_with_routes on timetables_vehicle_schedule_vehicle_schedule_frame {
    vehicle_schedule_frame_id
    validity_start
    validity_end
    vehicle_services {
      vehicle_service_id
      journey_patterns_in_vehicle_service {
        journey_pattern_instance {
          journey_pattern_id
          journey_pattern_route {
            route_id
            label
          }
        }
      }
    }
  }
`;

const GQL_GET_VEHICLE_SCHEDULE_FRAME_WITH_ROUTES = gql`
  query GetVehicleScheduleFrameWithRoutes($vehicle_schedule_frame_id: uuid!) {
    timetables {
      timetables_vehicle_schedule_vehicle_schedule_frame(
        where: {
          vehicle_schedule_frame_id: { _eq: $vehicle_schedule_frame_id }
        }
      ) {
        ...vehicle_schedule_frame_with_routes
      }
    }
  }
`;

const GQL_UPDATE_VEHICLE_SCHEDULE_FRAME_VALIDITY = gql`
  mutation UpdateVehicleScheduleFrameValidity(
    $vehicle_schedule_frame_id: uuid!
    $validity_start: date
    $validity_end: date
  ) {
    timetables {
      timetables_update_vehicle_schedule_vehicle_schedule_frame(
        _set: { validity_start: $validity_start, validity_end: $validity_end }
        where: {
          vehicle_schedule_frame_id: { _eq: $vehicle_schedule_frame_id }
        }
      ) {
        returning {
          vehicle_schedule_frame_id
          validity_start
          validity_end
        }
      }
    }
  }
`;

function validLabel(label: string | null | undefined): label is string {
  return !!label;
}

export const useVehicleScheduleFrameValidity = (
  vehicleScheduleFrameId?: UUID,
) => {
  const vehicleScheduleFrameResult = useGetVehicleScheduleFrameWithRoutesQuery({
    variables: {
      // The query is skipped if vehicleScheduleFrameId is undefined
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      vehicle_schedule_frame_id: vehicleScheduleFrameId!,
    },
    skip: !vehicleScheduleFrameId,
  });

  const vehicleScheduleFrame =
    vehicleScheduleFrameResult.data?.timetables
      ?.timetables_vehicle_schedule_vehicle_schedule_frame[0];

  const allAffectedRouteLabels =
    vehicleScheduleFrame?.vehicle_services
      .flatMap(
        (vehicleService) => vehicleService.journey_patterns_in_vehicle_service,
      )
      .map(
        (journeyPatternInVehicleService) =>
          journeyPatternInVehicleService.journey_pattern_instance,
      )
      .map((journeyPattern) => journeyPattern?.journey_pattern_route?.label)
      .filter(validLabel) ?? [];

  const affectedRouteLabels = uniq(allAffectedRouteLabels);

  const [updateVehicleScheduleValidityMutation] =
    useUpdateVehicleScheduleFrameValidityMutation();

  const updateValidity = async (validityStart: string, validityEnd: string) => {
    if (!vehicleScheduleFrameId) {
      return;
    }

    await updateVehicleScheduleValidityMutation({
      variables: {
        vehicle_schedule_frame_id: vehicleScheduleFrameId,
        validity_start: DateTime.fromISO(validityStart),
        validity_end: DateTime.fromISO(validityEnd),
      },
    });
  };

  return { vehicleScheduleFrame, affectedRouteLabels, updateValidity };
};
