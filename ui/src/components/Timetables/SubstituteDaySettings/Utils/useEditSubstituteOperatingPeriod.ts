import { gql } from '@apollo/client';
import { useCallback } from 'react';
import {
  TimetablesServiceCalendarSubstituteOperatingPeriodInsertInput,
  useEditSubstituteOperatingPeriodsMutation,
} from '../../../../generated/graphql';
import {
  CommonSubstitutePeriodType,
  PeriodType,
} from '../OccasionalSubstitutePeriod/OccasionalSubstitutePeriodForm.types';
import { mapPeriodsToDayByLineTypes } from '../utils';

// Hasura doesn't support updating nested objects in one mutation
// https://hasura.io/docs/latest/mutations/postgres/update/
// First mutation updates substitute operating periods name with upsert clause
// Second mutation removes substitute operating days that are under "update"
// Last mutation inserts new rows for each day and line type
const GQL_UPDATE_SUBSTITUTE_PERIOD = gql`
  mutation EditSubstituteOperatingPeriods(
    $periodsToInsert: [timetables_service_calendar_substitute_operating_period_insert_input!]!
    $periodsToDelete: [uuid!]!
    $daysToInsert: [timetables_service_calendar_substitute_operating_day_by_line_type_insert_input!]!
  ) {
    timetables {
      timetables_insert_service_calendar_substitute_operating_period(
        objects: $periodsToInsert
        on_conflict: {
          constraint: substitute_operating_period_pkey
          update_columns: [period_name]
        }
      ) {
        affected_rows
      }

      timetables_delete_service_calendar_substitute_operating_day_by_line_type(
        where: { substitute_operating_period_id: { _in: $periodsToDelete } }
      ) {
        affected_rows
      }

      timetables_insert_service_calendar_substitute_operating_day_by_line_type(
        objects: $daysToInsert
      ) {
        affected_rows
      }
    }
  }
`;

export function useEditSubstituteOperatingPeriod() {
  const [mutateFunction] = useEditSubstituteOperatingPeriodsMutation();

  return useCallback(
    (periods: ReadonlyArray<PeriodType | CommonSubstitutePeriodType>) => {
      const filtered = periods.filter((p) => p.periodId && !p.toBeDeleted);

      const periodsToInsert: TimetablesServiceCalendarSubstituteOperatingPeriodInsertInput[] =
        filtered.map((p) => ({
          substitute_operating_period_id: p.periodId,
          period_name: p.periodName,
          is_preset: p.isPreset,
        }));

      const periodsToDelete = filtered
        .map((p) => p.periodId)
        .filter((id): id is UUID => typeof id === 'string' && id !== '');

      const daysToInsert = filtered.flatMap((p) =>
        mapPeriodsToDayByLineTypes(p),
      );

      return mutateFunction({
        variables: { periodsToInsert, periodsToDelete, daysToInsert },
      });
    },
    [mutateFunction],
  );
}
