import { gql } from '@apollo/client';
import flatten from 'lodash/flatten';
import { PeriodType } from '../../components/timetables/day-settings/RandomReferenceDay/RandomReferenceDayForm.types';
import {
  EditSubstituteOperatingPeriodsMutationVariables,
  TimetablesServiceCalendarSubstituteOperatingPeriodInsertInput,
  useEditSubstituteOperatingPeriodsMutation,
} from '../../generated/graphql';
import { mapPeriodsToDayByLineTypes } from '../../utils/substituteOperatingPeriod';

export const useEditSubstituteOperatingPeriod = () => {
  const [mutateFunction] = useEditSubstituteOperatingPeriodsMutation({});
  const updateSubstituteOperatingPeriodMutation = async (
    variables: EditSubstituteOperatingPeriodsMutationVariables,
  ) => {
    return mutateFunction({
      variables,
    });
  };

  const mapFormStateToEditVariables = (
    periods: PeriodType[],
  ): EditSubstituteOperatingPeriodsMutationVariables => {
    const periodsToInsert: TimetablesServiceCalendarSubstituteOperatingPeriodInsertInput[] =
      periods.map((p) => ({
        substitute_operating_period_id: p.periodId,
        period_name: p.periodName,
      }));
    const periodsToDelete: UUID[] = periods
      .filter((p) => typeof p.periodId === 'string' && p.periodId !== '')
      .map((p) => p.periodId) as UUID[];

    const substituteOperatingDaysByLineType = periods.map((p) =>
      mapPeriodsToDayByLineTypes(p),
    );
    const daysToInsert = flatten(substituteOperatingDaysByLineType);
    return { periodsToInsert, periodsToDelete, daysToInsert };
  };
  return {
    updateSubstituteOperatingPeriodMutation,
    mapFormStateToEditVariables,
  };
};

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
