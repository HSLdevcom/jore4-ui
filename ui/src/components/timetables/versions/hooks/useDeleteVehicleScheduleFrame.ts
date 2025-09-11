import { ApolloError, gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  DeleteVehicleScheduleFrameMutationVariables,
  useDeleteVehicleScheduleFrameMutation,
} from '../../../../generated/graphql';
import { Operation, openErrorListModalAction } from '../../../../redux';
import { getApolloErrorMessage } from '../../../../utils/apolloErrors';
import { useLoader } from '../../../common/hooks';

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
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [mutateFunction] = useDeleteVehicleScheduleFrameMutation({
    onCompleted,
  });

  const { setIsLoading } = useLoader(Operation.DeleteTimetable);

  const deleteVehicleScheduleFrameMutation = async (
    variables: DeleteVehicleScheduleFrameMutationVariables,
  ) => {
    setIsLoading(true);
    try {
      await mutateFunction({
        variables,
      });
    } catch (error: unknown) {
      if (error instanceof ApolloError) {
        const errorText = getApolloErrorMessage(error);
        dispatch(
          openErrorListModalAction({
            errorModalTitle: t('deleteTimetableModal.errorModalTitle'),
            errorList: [
              {
                errorTitle: t('deleteTimetableModal.errorMessage'),
                details: errorText,
                key: errorText,
              },
            ],
          }),
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteVehicleScheduleFrameMutation,
  };
};
