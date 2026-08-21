import { gql } from '@apollo/client';
import { useCallback } from 'react';
import { useDeleteSubstituteOperatingPeriodMutation } from '../../../../generated/graphql';
import { PeriodType } from '../OccasionalSubstitutePeriod/OccasionalSubstitutePeriodForm.types';

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

export function useDeleteSubstituteOperatingPeriod() {
  const [mutateFunction] = useDeleteSubstituteOperatingPeriodMutation();

  return useCallback(
    (periods: ReadonlyArray<Pick<PeriodType, 'periodId' | 'toBeDeleted'>>) =>
      mutateFunction({
        variables: {
          ids: periods
            .filter((p) => p.toBeDeleted)
            .map((p) => p.periodId)
            .filter((p): p is UUID => !!p),
        },
      }),
    [mutateFunction],
  );
}
