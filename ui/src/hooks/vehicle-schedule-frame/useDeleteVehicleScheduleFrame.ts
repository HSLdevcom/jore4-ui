import { gql } from '@apollo/client';
import {
  DeleteVehicleScheduleFrameMutationVariables,
  useDeleteVehicleScheduleFrameMutation,
} from '../../generated/graphql';

const GQL_DELETE_VEHICLE_SCHEDULE_FRAME = gql`
  mutation DeleteVehicleScheduleFrame($vehicle_schedule_frame_id: uuid!) {
    timetables {
      timetables_delete_vehicle_schedule_vehicle_schedule_frame_by_pk(
        vehicle_schedule_frame_id: $vehicle_schedule_frame_id
      ) {
        vehicle_schedule_frame_id
      }
    }
  }
`;

export const useDeleteVehicleScheduleFrame = ({
  onCompleted,
}: {
  onCompleted?: () => void;
} = {}) => {
  const [mutateFunction, { loading }] = useDeleteVehicleScheduleFrameMutation({
    onCompleted,
  });

  const deleteVehicleScheduleFrameMutation = async (
    variables: DeleteVehicleScheduleFrameMutationVariables,
  ) => {
    await mutateFunction({
      variables,
    });
  };

  return {
    deleteVehicleScheduleFrameMutation,
    loading,
  };
};
