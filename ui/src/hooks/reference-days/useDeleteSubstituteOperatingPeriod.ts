import { gql } from '@apollo/client';
import { useDeleteSubstituteOperatingPeriodMutation } from '../../generated/graphql';

const GQL_DELETE_SUBSTITUTE_OPERATING_PERIOD = gql`
  mutation DeleteSubstituteOperatingPeriod($id: uuid!) {
    timetables {
      timetables_delete_service_calendar_substitute_operating_period_by_pk(
        substitute_operating_period_id: $id
      ) {
        substitute_operating_period_id
      }
    }
  }
`;
export const useDeleteSubstituteOperatingPeriod = () => {
  const [mutateFunction] = useDeleteSubstituteOperatingPeriodMutation();

  const deleteSubstituteOperatingPeriod = async (id: UUID) => {
    return mutateFunction({
      variables: { id },
    });
  };
  return { deleteSubstituteOperatingPeriod };
};
