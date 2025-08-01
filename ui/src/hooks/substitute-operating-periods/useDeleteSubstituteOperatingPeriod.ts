import { gql } from '@apollo/client';
import { PeriodType } from '../../components/timetables/substitute-day-settings/OccasionalSubstitutePeriod/OccasionalSubstitutePeriodForm.types';
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

  const deleteSubstituteOperatingPeriod = async (form: {
    periods: ReadonlyArray<Pick<PeriodType, 'periodId' | 'toBeDeleted'>>;
  }) => {
    const deletedIds = form.periods
      .filter((p) => p.toBeDeleted)
      .map((p) => p.periodId as string);
    return mutateFunction({
      variables: { ids: deletedIds },
    });
  };
  return { deleteSubstituteOperatingPeriod };
};
