import { gql } from '@apollo/client';
import flatten from 'lodash/flatten';
import { FormState } from '../../components/timetables/substitute-day-settings/OccasionalSubstitutePeriod/OccasionalSubstitutePeriodForm.types';
import {
  EditSubstituteOperatingPeriodsMutationVariables,
  TimetablesServiceCalendarSubstituteOperatingPeriodInsertInput,
  useEditSubstituteOperatingPeriodsMutation,
} from '../../generated/graphql';
import { mapPeriodsToDayByLineTypes } from '../../utils/substituteOperatingPeriod';
import { MutationHook, extendHook } from '../mutationHook';

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

type EditParams = {
  readonly form: FormState;
};

type EditChanges = {
  readonly input: EditSubstituteOperatingPeriodsMutationVariables;
};

const useEditSubstituteOperatingPeriodHook: MutationHook<
  EditParams,
  EditChanges,
  EditSubstituteOperatingPeriodsMutationVariables
> = () => {
  const [mutateFunction] = useEditSubstituteOperatingPeriodsMutation();

  const executeMutation = (
    variables: EditSubstituteOperatingPeriodsMutationVariables,
  ) => mutateFunction({ variables });

  const mapFormStateToEditVariables = (
    params: EditParams,
  ): EditSubstituteOperatingPeriodsMutationVariables => {
    const filtered = params.form.periods.filter(
      (p) => p.periodId && !p.toBeDeleted,
    );

    const periodsToInsert: TimetablesServiceCalendarSubstituteOperatingPeriodInsertInput[] =
      filtered.map((p) => ({
        substitute_operating_period_id: p.periodId,
        period_name: p.periodName,
        is_preset: p.isPreset,
      }));

    const periodsToDelete: UUID[] = filtered
      .filter((p) => typeof p.periodId === 'string' && p.periodId !== '')
      .map((p) => p.periodId) as UUID[];

    const substituteOperatingDaysByLineType = filtered.map((p) =>
      mapPeriodsToDayByLineTypes(p),
    );
    const daysToInsert = flatten(substituteOperatingDaysByLineType);
    return { periodsToInsert, periodsToDelete, daysToInsert };
  };

  const prepare = (params: EditParams): EditChanges => {
    const input = mapFormStateToEditVariables(params);
    const changes: EditChanges = { input };
    return changes;
  };

  const mapChangesToVariables = (
    changes: EditChanges,
  ): EditSubstituteOperatingPeriodsMutationVariables => {
    const variables: EditSubstituteOperatingPeriodsMutationVariables = {
      ...changes.input,
    };
    return variables;
  };

  return { prepare, mapChangesToVariables, executeMutation };
};

export const useEditSubstituteOperatingPeriod = extendHook(
  useEditSubstituteOperatingPeriodHook,
);
