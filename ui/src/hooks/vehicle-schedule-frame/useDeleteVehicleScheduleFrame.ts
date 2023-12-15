import { gql } from '@apollo/client';
import {
  DeleteVehicleScheduleFrameMutationVariables,
  useDeleteVehicleScheduleFrameMutation,
} from '../../generated/graphql';
import { Operation } from '../../redux';
import { useLoader } from '../ui';

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
  const [mutateFunction] = useDeleteVehicleScheduleFrameMutation({
    onCompleted,
  });

  const { setIsLoading } = useLoader(Operation.DeleteTimetable);

  const deleteVehicleScheduleFrameMutation = async (
    variables: DeleteVehicleScheduleFrameMutationVariables,
  ) => {
    setIsLoading(true);
    await mutateFunction({
      variables,
    });
    setIsLoading(false);
  };

  return {
    deleteVehicleScheduleFrameMutation,
  };
};
