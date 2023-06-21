import { gql } from '@apollo/client';
import { FormState } from '../../components/timetables/substitute-day-settings/OccasionalSubstitutePeriod/OccasionalSubstitutePeriodForm.types';
import { useDeleteSubstituteOperatingPeriodMutation } from '../../generated/graphql';

const GQL_DELETE_SUBSTITUTE_OPERATING_PERIOD = gql`
  mutation DeleteSubstituteOperatingPeriod($ids: [uuid!]!) {
    timetables {
      timetables_delete_service_calendar_substitute_operating_period(
        where: { substitute_operating_period_id: { _in: $ids } }
      ) {
        affected_rows
      }
    }
  }
`;
export const useDeleteSubstituteOperatingPeriod = () => {
  const [mutateFunction] = useDeleteSubstituteOperatingPeriodMutation();

  const deleteSubstituteOperatingPeriod = async (form: FormState) => {
    const deletedIds = form.periods
      .filter((p) => p.deleted)
      .map((p) => p.periodId as string);
    return mutateFunction({
      variables: { ids: deletedIds },
    });
  };
  return { deleteSubstituteOperatingPeriod };
};
